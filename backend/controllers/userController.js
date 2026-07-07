import bcrypt from "bcrypt";
import UserModel from "../models/UserModel.js";

class UserController {
  static async registerStaff(req, res) { /* ... */ }
  static async createManager(req, res) { /* ... */ }
  static async approveUser(req, res) { /* ... */ }
  static async listPending(req, res) { /* ... */ }
}

export default UserController;
