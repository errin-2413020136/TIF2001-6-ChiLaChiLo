jest.mock("../src/config/database", () => ({
  query: jest.fn(),
  connect: jest.fn(),
}));

const pool = require("../src/config/database");
const inventory = require("../src/controllers/inventory.controller");

function response() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

function transactionClient(results) {
  const client = {
    query: jest.fn(),
    release: jest.fn(),
  };
  for (const result of results) client.query.mockResolvedValueOnce(result);
  return client;
}

describe("inventory controller", () => {
  beforeEach(() => jest.clearAllMocks());

  test("listProducts mengembalikan produk untuk cabang default", async () => {
    pool.query
      .mockResolvedValueOnce({ rows: [{ id: 1 }] })
      .mockResolvedValueOnce({ rows: [{ id: 10, name: "Large", price: 20000, stock: 15, unit: "Porsi" }] });
    const res = response();

    await inventory.listProducts({ query: {} }, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json.mock.calls[0][0].items).toHaveLength(1);
  });

  test("adjustStock menolak stok negatif sebelum membuka transaksi", async () => {
    const res = response();

    await inventory.adjustStock({
      params: { id: "1", itemType: "product" },
      body: { stock: -1 },
      auth: { sub: "1" },
    }, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(pool.connect).not.toHaveBeenCalled();
  });

  test("adjustStock menyimpan perubahan dan riwayat dalam satu transaksi", async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });
    const client = transactionClient([
      {}, { rows: [{ id: 10, stock: 20 }] },
      { rows: [{ id: 10, stock: 20 }] }, {}, {},
    ]);
    pool.connect.mockResolvedValue(client);
    const res = response();

    await inventory.adjustStock({
      params: { id: "10", itemType: "product" },
      body: { stock: 20, note: "Restok mingguan" },
      auth: { sub: "1" },
    }, res);

    expect(client.query).toHaveBeenNthCalledWith(1, "BEGIN");
    expect(client.query).toHaveBeenCalledWith(
      expect.stringContaining("FOR UPDATE"), [10, 1]
    );
    expect(client.query).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO stock_movements"),
      [1, "product", 10, 20, 20, "Restok mingguan", "1"]
    );
    expect(client.query).toHaveBeenLastCalledWith("COMMIT");
    expect(client.release).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("createSale menolak keranjang kosong", async () => {
    const res = response();

    await inventory.createSale({ body: {}, auth: { sub: "1" } }, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(pool.connect).not.toHaveBeenCalled();
  });

  test("createSale membatalkan transaksi ketika stok tidak cukup", async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });
    const client = transactionClient([
      {}, { rows: [{ id: 5 }] },
      { rows: [{ id: 10, name: "Large", price: "20000", stock: 1 }] },
      {},
    ]);
    pool.connect.mockResolvedValue(client);
    const res = response();

    await inventory.createSale({
      body: { items: [{ productId: 10, quantity: 2 }], paymentMethod: "cash" },
      auth: { sub: "1" },
    }, res);

    expect(client.query).toHaveBeenLastCalledWith("ROLLBACK");
    expect(client.release).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(409);
  });
});
