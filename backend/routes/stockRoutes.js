import express from "express";
import * as StockController from "../controllers/stockController.js";
import db from "../config/db.js";

const router = express.Router();

// Items
router.post("/items", StockController.createItem);
router.get("/items", StockController.listItems);

// Batches
router.post("/batches", StockController.createBatch);
// Get batches for a specific item
router.get("/batches/:itemId", async (req, res) => {
  try {
    const { itemId } = req.params;
    const [rows] = await db.query(
      "SELECT * FROM stock_batches WHERE item_id = ?",
      [itemId]
    );
    res.json(rows); 
  } catch (err) {
    console.error("Error fetching batches:", err);
    res.status(500).json({ error: "Failed to fetch batches" });
  }
});
// Update item
router.put("/items/:itemId", async (req, res) => {
  try {
    const { itemId } = req.params;
    const { name, sku, min_stock_level } = req.body;
    await db.query(
      "UPDATE stock_items SET name=?, sku=?, min_stock_level=? WHERE item_id=?",
      [name, sku, min_stock_level, itemId]
    );
    res.json({ message: "Item updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete item
router.delete("/items/:itemId", async (req, res) => {
  try {
    const { itemId } = req.params;
    await db.query("DELETE FROM stock_items WHERE item_id=?", [itemId]);
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Transactions
router.post("/transactions", StockController.createTransaction);
router.get("/transactions", StockController.listTransactions);

export default router;
