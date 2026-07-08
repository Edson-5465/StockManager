import express from "express";
import UserController from "../controllers/userController.js";
import passport from "passport";
import db from "../config/db.js";

const router = express.Router();

router.get("/test", (req, res) => {
  res.json({ message: "Test route works" });
});

router.post("/staff/register", UserController.registerStaff); 

console.log("User routes loaded");

router.post("/manager/create", UserController.createManager);
router.patch("/approve/:id", UserController.approveUser);
router.get("/pending", UserController.listPending);

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(400).json({ error: info.message });

    req.logIn(user, (err) => {
      if (err) return next(err);

      // Send role + status back to frontend
      res.json({
        message: "Login successful",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status
        }
      });
    });
  })(req, res, next);
});

router.get("/list", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT u.id, u.name, u.email, u.role, u.status, 
             a.name AS approved_by, 
             u.created_at
      FROM users u
      LEFT JOIN users a ON u.approved_by = a.id
      ORDER BY u.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: err.message });
  }
});


// Approve user
router.put("/approve/:id", async (req, res) => {
  try {
    // req.user.id comes from Passport session (the logged-in admin)
    await db.query(
      "UPDATE users SET status='active', approved_by=? WHERE id=?",
      [req.user?.id || null, req.params.id]
    );

    // Log the action in audit_logs
    await db.query(
      "INSERT INTO audit_logs (user_id, action, performed_by) VALUES (?, ?, ?)",
      [req.params.id, "approve", req.user?.id || null]
    );

    res.json({ message: "User approved" });
  } catch (err) {
    console.error("Error approving user:", err);
    res.status(500).json({ error: err.message });
  }
});

// Reject user
router.put("/reject/:id", async (req, res) => {
  try {
    await db.query("UPDATE users SET status='rejected' WHERE id=?", [
      req.params.id,
    ]);
    res.json({ message: "User rejected" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Logout route
router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    req.session.destroy(() => {
      res.clearCookie("connect.sid"); // clear session cookie
      res.json({ message: "Logged out successfully" });
    });
  });
});
// Delete user
router.delete("/delete/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM users WHERE id = ?", [req.params.id]);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: err.message });
  }
});


 // Update staff role
router.put("/role/:id", async (req, res) => {
  const { role } = req.body;
  if (!["admin", "manager", "staff"].includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }

  try {
    await db.query("UPDATE users SET role=? WHERE id=?", [
      role,
      req.params.id,
    ]);

    // Log the action
    await db.query(
      "INSERT INTO audit_logs (user_id, action, performed_by) VALUES (?, ?, ?)",
      [req.params.id, `role_changed_to_${role}`, req.user?.id || null]
    );

    res.json({ message: "Role updated successfully" });
  } catch (err) {
    console.error("Error updating role:", err);
    res.status(500).json({ error: err.message });
  }
});


// Audit logs (example: fetch all logs)
router.get("/logs", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM audit_logs ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching logs:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;

