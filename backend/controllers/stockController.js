import * as ItemModel from "../models/stockItemModel.js";
import * as BatchModel from "../models/stockBatchModel.js";
import * as TxnModel from "../models/stockTransactionModel.js";
import db from "../config/db.js";

// Items
export const createItem = async (req, res) => {
  try {
    const id = await ItemModel.addItem(req.body);
    res.json({ message: "Item added", item_id: id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const listItems = async (req, res) => {
  try {
    const items = await ItemModel.getItems();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const getBatchStatus = (expiryDate) => {
  const today = new Date();
  const exp = new Date(expiryDate);

  if (exp < today) return "EXPIRED";

  const diffDays = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
  if (diffDays <= 3) return "NEAR_EXPIRY";

  return "GOOD";
};

export const createBatch = async (req, res) => {
  try {
    const { item_id, batch_number, quantity, expiry_date } = req.body;

    const status = getBatchStatus(expiry_date);

    //  Reject expired batches
    if (status === "EXPIRED") {
      return res.status(400).json({
        error: "Cannot add batch. Expiry date is already past."
      });
    }

    const [result] = await db.query(
      `INSERT INTO stock_batches (item_id, batch_number, quantity, expiry_date, status)
       VALUES (?, ?, ?, ?, ?)`,
      [item_id, batch_number, quantity, expiry_date, status]
    );

    res.json({ message: "Batch added", batch_id: result.insertId, status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

 

export const listBatches = async (req, res) => {
  try {
    const batches = await BatchModel.getBatchesByItem(req.params.itemId);
    res.json(batches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Transactions
export const createTransaction = async (req, res) => {
  try {
    const id = await TxnModel.addTransaction(req.body);
    res.json({ message: "Transaction recorded", transaction_id: id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const listTransactions = async (req, res) => {
  try {
    const txns = await TxnModel.getTransactions();
    res.json(txns);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
