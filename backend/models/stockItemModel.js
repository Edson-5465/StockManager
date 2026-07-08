import db from "../config/db.js";

export const addItem = async (item) => {
  const [result] = await db.query(
    "INSERT INTO stock_items (sku, name, description, category, min_stock_level) VALUES (?, ?, ?, ?, ?)",
    [item.sku, item.name, item.description, item.category, item.min_stock_level]
  );
  return result.insertId;
};

export const getItems = async () => {
  const [rows] = await db.query("SELECT * FROM stock_items");
  return rows;
};
