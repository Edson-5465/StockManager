// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import db from "./config/db.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/users", userRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("StockManager API running...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  try {
    await db.query("SELECT 1");
    console.log(`Server running on port ${PORT}`);
  } catch (err) {
    console.error("Database connection failed:", err.message);
  }
});
