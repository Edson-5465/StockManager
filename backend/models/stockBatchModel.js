import db from "../config/db.js";

export const addBatch = async (batch) => {
  const [result] = await db.query(
    `INSERT INTO stock_batches 
      (item_id, batch_number, quantity, expiry_date, status) 
     VALUES (?, ?, ?, ?, ?)`,
    [
      batch.item_id,
      batch.batch_number,
      batch.quantity,
      batch.expiry_date,
      batch.status || "GOOD" // default if not provided
    ]
  );
  return result.insertId;
};

export const getBatchesByItem = async (itemId) => {
  const [rows] = await db.query(
    "SELECT * FROM stock_batches WHERE item_id=? ORDER BY expiry_date ASC",
    [itemId]
  );
  return rows;
};
