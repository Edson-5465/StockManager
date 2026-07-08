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
    const [rows] = await db.query("SELECT * FROM users");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Approve user
router.put("/approve/:id", async (req, res) => {
  try {
    await db.query(
      "UPDATE users SET status='active', approved_by=? WHERE id=?",
      [req.user?.id || null, req.params.id]
    );
    res.json({ message: "User approved" });
  } catch (err) {
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

export default router;

