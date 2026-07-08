import bcrypt from "bcrypt";
import UserModel from "../models/UserModel.js";

class UserController {
  static async registerStaff(req, res) {
  try {
    const { name, email, password, cellphone } = req.body;
    const hash = await bcrypt.hash(password, 10);

    await UserModel.createStaff(name, email, hash, cellphone);

    res.json({ message: "Staff registration submitted. Awaiting admin approval." });
  } catch (err) {
    console.error("RegisterStaff error:", err);
    res.status(500).json({ error: err.message });
  }
}


  static async createManager(req, res) { /* ... */ }
  static async approveUser(req, res) { /* ... */ }
  static async listPending(req, res) { /* ... */ }
}

export default UserController;
