// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import db from "./config/db.js";
import session from "express-session";
import passport from "passport";
import configurePassport from "./config/passport.js";
import stockRoutes from "./routes/stockRoutes.js"
import "./utils/batchScheduler.js"; 


dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",  
  credentials: true                 
}));

// Session + Passport
app.use(session({
  secret: process.env.SESSION_SECRET || "fallback_secret",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
configurePassport(passport);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/stock", stockRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("StockManager API running...");
});

// Catch-all 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
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
