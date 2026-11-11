const express = require("express");
const { authenticateToken } = require("../controllers/auth.controller");
const inventory = require("../controllers/inventory.controller");

const router = express.Router();

router.use(authenticateToken);
router.get("/products", inventory.listProducts);
router.get("/ingredients", inventory.listIngredients);
router.patch("/products/:id/stock", (req, res) => {
  req.params.itemType = "product";
  return inventory.adjustStock(req, res);
});
router.patch("/ingredients/:id/stock", (req, res) => {
  req.params.itemType = "ingredient";
  return inventory.adjustStock(req, res);
});
router.post("/sales", inventory.createSale);
router.get("/sales", inventory.listSales);
router.get("/stock-movements", inventory.listStockMovements);
router.get("/branches", inventory.listBranches);
router.get("/branches/:id/summary", inventory.branchSummary);
router.get("/shifts", inventory.listShifts);
router.post("/shifts/open", inventory.openShift);
router.patch("/shifts/active/close", inventory.closeActiveShift);

module.exports = router;
