const pool = require("../config/database");

const PAYMENT_METHODS = new Set(["cash", "qris", "transfer", "other"]);

function parsePositiveId(value) {
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

async function resolveBranchId(value) {
  const requested = value === undefined ? null : parsePositiveId(value);
  if (value !== undefined && !requested) return null;
  if (requested) return requested;
  const result = await pool.query("SELECT id FROM branches WHERE name = $1", ["Cabang Nganjuk"]);
  return result.rows[0]?.id || null;
}

function respondServerError(res, error, label) {
  console.error(`${label}:`, error.message);
  return res.status(500).json({ message: "Terjadi kesalahan pada server." });
}

async function listProducts(req, res) {
  try {
    const branchId = await resolveBranchId(req.query.branchId);
    if (!branchId) return res.status(404).json({ message: "Cabang tidak ditemukan." });
    const result = await pool.query(
      "SELECT id, name, price::float AS price, stock, unit FROM products WHERE branch_id = $1 AND is_active = TRUE ORDER BY id",
      [branchId]
    );
    return res.status(200).json({ items: result.rows });
  } catch (error) {
    return respondServerError(res, error, "List products failed");
  }
}

async function listIngredients(req, res) {
  try {
    const branchId = await resolveBranchId(req.query.branchId);
    if (!branchId) return res.status(404).json({ message: "Cabang tidak ditemukan." });
    const result = await pool.query(
      "SELECT id, name, stock::float AS stock, minimum_stock::float AS minimum, unit, (stock <= minimum_stock) AS needs_restock FROM ingredients WHERE branch_id = $1 ORDER BY id",
      [branchId]
    );
    return res.status(200).json({ items: result.rows });
  } catch (error) {
    return respondServerError(res, error, "List ingredients failed");
  }
}

async function adjustStock(req, res) {
  const itemId = parsePositiveId(req.params.id);
  const stock = Number(req.body?.stock);
  const note = typeof req.body?.note === "string" ? req.body.note.trim() : "";
  const itemType = req.params.itemType;
  if (!itemId || !Number.isFinite(stock) || stock < 0 || (itemType === "product" && !Number.isInteger(stock)) || note.length > 500) {
    return res.status(400).json({ message: "ID, jumlah stok, atau catatan perubahan tidak valid." });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const branchId = await resolveBranchId(req.body?.branchId);
    if (!branchId) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Cabang tidak ditemukan." });
    }
    const table = itemType === "product" ? "products" : "ingredients";
    const idColumn = itemType === "product" ? "product_id" : "ingredient_id";
    const current = await client.query(
      `SELECT id, stock FROM ${table} WHERE id = $1 AND branch_id = $2 FOR UPDATE`,
      [itemId, branchId]
    );
    if (!current.rows[0]) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Item stok tidak ditemukan." });
    }
    const previous = Number(current.rows[0].stock);
    const updated = await client.query(
      `UPDATE ${table} SET stock = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND branch_id = $3 RETURNING id, stock`,
      [stock, itemId, branchId]
    );
    await client.query(
      `INSERT INTO stock_movements (branch_id, item_type, ${idColumn}, movement_type, quantity_before, quantity_after, note, created_by) VALUES ($1, $2, $3, 'adjustment', $4, $5, $6, $7)`,
      [branchId, itemType, itemId, previous, stock, note || null, req.auth.sub]
    );
    await client.query("COMMIT");
    return res.status(200).json({ message: "Stok berhasil diperbarui.", item: updated.rows[0] });
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    return respondServerError(res, error, "Stock adjustment failed");
  } finally {
    client.release();
  }
}

async function createSale(req, res) {
  const items = req.body?.items;
  const paymentMethod = req.body?.paymentMethod || "cash";
  if (!Array.isArray(items) || items.length < 1 || items.length > 50 || !PAYMENT_METHODS.has(paymentMethod)) {
    return res.status(400).json({ message: "Daftar item atau metode pembayaran tidak valid." });
  }
  const normalized = [];
  for (const item of items) {
    const productId = parsePositiveId(item?.productId);
    const quantity = Number(item?.quantity);
    if (!productId || !Number.isSafeInteger(quantity) || quantity < 1 || quantity > 1000) {
      return res.status(400).json({ message: "Setiap item harus memiliki productId dan quantity yang valid." });
    }
    normalized.push({ productId, quantity });
  }
  if (new Set(normalized.map((item) => item.productId)).size !== normalized.length) {
    return res.status(400).json({ message: "Product yang sama tidak boleh dikirim lebih dari sekali." });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const branchId = await resolveBranchId(req.body?.branchId);
    if (!branchId) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Cabang tidak ditemukan." });
    }
    const shiftResult = await client.query(
      "SELECT id FROM shifts WHERE branch_id = $1 AND status = 'active' ORDER BY started_at DESC LIMIT 1 FOR UPDATE",
      [branchId]
    );
    if (!shiftResult.rows[0]) {
      await client.query("ROLLBACK");
      return res.status(409).json({ message: "Tidak ada shift aktif pada cabang ini." });
    }

    const saleLines = [];
    let total = 0;
    for (const item of normalized) {
      const productResult = await client.query(
        "SELECT id, name, price, stock FROM products WHERE id = $1 AND branch_id = $2 AND is_active = TRUE FOR UPDATE",
        [item.productId, branchId]
      );
      const product = productResult.rows[0];
      if (!product) {
        await client.query("ROLLBACK");
        return res.status(404).json({ message: `Produk ${item.productId} tidak ditemukan.` });
      }
      if (Number(product.stock) < item.quantity) {
        await client.query("ROLLBACK");
        return res.status(409).json({ message: `Stok ${product.name} tidak mencukupi.` });
      }
      const unitPrice = Number(product.price);
      const subtotal = unitPrice * item.quantity;
      total += subtotal;
      saleLines.push({ ...item, product, unitPrice, subtotal });
    }

    const orderCode = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
    const saleResult = await client.query(
      "INSERT INTO sales (order_code, branch_id, shift_id, created_by, payment_method, total_amount) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, order_code, total_amount::float AS total, created_at",
      [orderCode, branchId, shiftResult.rows[0].id, req.auth.sub, paymentMethod, total]
    );
    const sale = saleResult.rows[0];

    for (const line of saleLines) {
      const after = Number(line.product.stock) - line.quantity;
      await client.query(
        "UPDATE products SET stock = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
        [after, line.product.id]
      );
      await client.query(
        "INSERT INTO sale_items (sale_id, product_id, product_name, unit_price, quantity, subtotal) VALUES ($1, $2, $3, $4, $5, $6)",
        [sale.id, line.product.id, line.product.name, line.unitPrice, line.quantity, line.subtotal]
      );
      await client.query(
        "INSERT INTO stock_movements (branch_id, item_type, product_id, movement_type, quantity_before, quantity_after, note, created_by) VALUES ($1, 'product', $2, 'sale', $3, $4, $5, $6)",
        [branchId, line.product.id, line.product.stock, after, `Penjualan ${orderCode}`, req.auth.sub]
      );
    }
    await client.query("COMMIT");
    return res.status(201).json({ message: "Transaksi berhasil dicatat.", sale, items: saleLines.map((line) => ({ productId: line.product.id, name: line.product.name, quantity: line.quantity, unitPrice: line.unitPrice, subtotal: line.subtotal })) });
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    return respondServerError(res, error, "Create sale failed");
  } finally {
    client.release();
  }
}

async function listSales(req, res) {
  const limit = Math.min(parsePositiveId(req.query.limit) || 50, 100);
  try {
    const branchId = await resolveBranchId(req.query.branchId);
    if (!branchId) return res.status(404).json({ message: "Cabang tidak ditemukan." });
    const result = await pool.query(
      `SELECT s.id, s.order_code, s.payment_method, s.total_amount::float AS total, s.created_at, sh.name AS shift_name,
        COALESCE(json_agg(json_build_object('name', si.product_name, 'quantity', si.quantity, 'subtotal', si.subtotal::float)) FILTER (WHERE si.id IS NOT NULL), '[]') AS items
       FROM sales s LEFT JOIN shifts sh ON sh.id = s.shift_id LEFT JOIN sale_items si ON si.sale_id = s.id
       WHERE s.branch_id = $1 GROUP BY s.id, sh.name ORDER BY s.created_at DESC LIMIT $2`,
      [branchId, limit]
    );
    return res.status(200).json({ items: result.rows });
  } catch (error) {
    return respondServerError(res, error, "List sales failed");
  }
}

async function listBranches(_req, res) {
  try {
    const result = await pool.query("SELECT id, name, manager_name, status FROM branches ORDER BY id");
    return res.status(200).json({ items: result.rows });
  } catch (error) {
    return respondServerError(res, error, "List branches failed");
  }
}

async function branchSummary(req, res) {
  const branchId = parsePositiveId(req.params.id);
  if (!branchId) return res.status(400).json({ message: "ID cabang tidak valid." });
  try {
    const result = await pool.query(
      `SELECT b.id, b.name, b.manager_name, b.status,
        COALESCE(sales.total_sales, 0)::float AS total_sales,
        COALESCE(items.portions_sold, 0)::int AS portions_sold,
        COALESCE(sales.transaction_count, 0)::int AS transaction_count
       FROM branches b
       LEFT JOIN (
         SELECT branch_id, SUM(total_amount) AS total_sales, COUNT(*) AS transaction_count
         FROM sales GROUP BY branch_id
       ) sales ON sales.branch_id = b.id
       LEFT JOIN (
         SELECT s.branch_id, SUM(si.quantity) AS portions_sold
         FROM sales s JOIN sale_items si ON si.sale_id = s.id GROUP BY s.branch_id
       ) items ON items.branch_id = b.id
       WHERE b.id = $1`,
      [branchId]
    );
    if (!result.rows[0]) return res.status(404).json({ message: "Cabang tidak ditemukan." });
    return res.status(200).json({ branch: result.rows[0] });
  } catch (error) {
    return respondServerError(res, error, "Branch summary failed");
  }
}

async function listShifts(req, res) {
  try {
    const branchId = await resolveBranchId(req.query.branchId);
    if (!branchId) return res.status(404).json({ message: "Cabang tidak ditemukan." });
    const result = await pool.query(
      "SELECT id, name, status, started_at, ended_at FROM shifts WHERE branch_id = $1 ORDER BY started_at DESC LIMIT 30",
      [branchId]
    );
    return res.status(200).json({ items: result.rows });
  } catch (error) {
    return respondServerError(res, error, "List shifts failed");
  }
}

async function openShift(req, res) {
  const branchId = await resolveBranchId(req.body?.branchId);
  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "Shift Siang";
  if (!branchId || !name || name.length > 50) {
    return res.status(400).json({ message: "Cabang atau nama shift tidak valid." });
  }
  try {
    const existing = await pool.query(
      "SELECT id FROM shifts WHERE branch_id = $1 AND status = 'active' LIMIT 1",
      [branchId]
    );
    if (existing.rows[0]) return res.status(409).json({ message: "Masih ada shift aktif pada cabang ini." });
    const result = await pool.query(
      "INSERT INTO shifts (branch_id, name, opened_by, status) VALUES ($1, $2, $3, 'active') RETURNING id, name, status, started_at",
      [branchId, name, req.auth.sub]
    );
    return res.status(201).json({ message: "Shift berhasil dimulai.", shift: result.rows[0] });
  } catch (error) {
    return respondServerError(res, error, "Open shift failed");
  }
}

async function listStockMovements(req, res) {
  const limit = Math.min(parsePositiveId(req.query.limit) || 50, 100);
  try {
    const branchId = await resolveBranchId(req.query.branchId);
    if (!branchId) return res.status(404).json({ message: "Cabang tidak ditemukan." });
    const result = await pool.query(
      `SELECT id, item_type, product_id, ingredient_id, movement_type,
        quantity_before::float AS quantity_before, quantity_after::float AS quantity_after,
        note, created_at
       FROM stock_movements WHERE branch_id = $1 ORDER BY created_at DESC LIMIT $2`,
      [branchId, limit]
    );
    return res.status(200).json({ items: result.rows });
  } catch (error) {
    return respondServerError(res, error, "List stock movements failed");
  }
}

async function closeActiveShift(req, res) {
  const branchId = await resolveBranchId(req.body?.branchId);
  if (!branchId) return res.status(404).json({ message: "Cabang tidak ditemukan." });
  try {
    const result = await pool.query(
      "UPDATE shifts SET status = 'closed', ended_at = CURRENT_TIMESTAMP, closed_by = $1 WHERE branch_id = $2 AND status = 'active' RETURNING id, name, status, started_at, ended_at",
      [req.auth.sub, branchId]
    );
    if (!result.rows[0]) return res.status(409).json({ message: "Tidak ada shift aktif untuk diakhiri." });
    return res.status(200).json({ message: "Shift berhasil diakhiri.", shift: result.rows[0] });
  } catch (error) {
    return respondServerError(res, error, "Close shift failed");
  }
}

module.exports = {
  listProducts,
  listIngredients,
  adjustStock,
  createSale,
  listSales,
  listBranches,
  branchSummary,
  listShifts,
  openShift,
  closeActiveShift,
  listStockMovements,
};
