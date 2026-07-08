import express from "express";
import * as StockController from "../controllers/stockController.js";

const router = express.Router();

// Items
router.post("/items", StockController.createItem);
router.get("/items", StockController.listItems);

// Batches
router.post("/batches", StockController.createBatch);
router.get("/batches/:itemId", StockController.listBatches);

// Transactions
router.post("/transactions", StockController.createTransaction);
router.get("/transactions", StockController.listTransactions);

export default router;
