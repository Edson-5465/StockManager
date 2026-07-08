import cron from "node-cron";
import db from "../config/db.js";

// Runs every day at midnight
cron.schedule("0 0 * * *", async () => {
  try {
    // Mark expired
    await db.query(
      "UPDATE stock_batches SET status='EXPIRED' WHERE expiry_date < CURDATE()"
    );

    // Mark near expiry (within 3 days)
    await db.query(
      "UPDATE stock_batches SET status='NEAR_EXPIRY' WHERE expiry_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 3 DAY)"
    );

    console.log("Batch statuses updated automatically");
  } catch (err) {
    console.error("Error updating batch statuses:", err);
  }
});
