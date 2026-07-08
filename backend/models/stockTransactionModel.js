import db from "../config/db.js";

export const addTransaction = async (txn) => {
  const [result] = await db.query(
    "INSERT INTO stock_transactions (batch_id, staff_id, action, quantity) VALUES (?, ?, ?, ?)",
    [txn.batch_id, txn.staff_id, txn.action, txn.quantity]
  );
  return result.insertId;
};

export const getTransactions = async () => {
  const [rows] = await db.query("SELECT * FROM stock_transactions ORDER BY created_at DESC");
  return rows;
};
