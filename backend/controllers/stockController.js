import * as ItemModel from "../models/stockItemModel.js";
import * as BatchModel from "../models/stockBatchModel.js";
import * as TxnModel from "../models/stockTransactionModel.js";

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

// Batches
export const createBatch = async (req, res) => {
  try {
    console.log("Batch request body:", req.body);
    const id = await BatchModel.addBatch(req.body);
    res.json({ message: "Batch added", batch_id: id });
  } catch (err) {
    console.error("Batch insert error:", err);
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
