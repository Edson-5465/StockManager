import db from "../config/db.js";

class UserModel {
  static async createStaff(name, email, passwordHash, cellphone) {
    return db.query(
      "INSERT INTO users (name, email, password_hash, cellphone, status, role) VALUES (?, ?, ?, ?, ?, ?)",
      [name, email, passwordHash, cellphone, "pending", "staff"]
    );
  }

  static async createManager(name, email, passwordHash, adminId) {
    return db.query(
      "INSERT INTO users (name, email, password_hash, status, role, approved_by) VALUES (?, ?, ?, ?, ?, ?)",
      [name, email, passwordHash, "approved", "manager", adminId]
    );
  }

  static async approveUser(userId, adminId) {
    return db.query(
      "UPDATE users SET status = 'approved', approved_by = ? WHERE id = ?",
      [adminId, userId]
    );
  }

  static async findPending() {
    const [rows] = await db.query("SELECT * FROM users WHERE status = 'pending'");
    return rows;
  }

  static async findByEmail(email) {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    return rows[0];
  }

  
}

export default UserModel;
