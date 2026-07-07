import db from "../config/db.js";

class UserModel {
  static async createStaff(name, email, passwordHash, cellphone) { /* ... */ }
  static async createManager(name, email, passwordHash, adminId) { /* ... */ }
  static async approveUser(userId, adminId) { /* ... */ }
  static async findPending() { /* ... */ }
  static async findByEmail(email) { /* ... */ }
}

export default UserModel;
