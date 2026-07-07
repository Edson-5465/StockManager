import express from "express";
import UserController from "../controllers/userController.js";

const router = express.Router();

router.post("/staff/register", UserController.registerStaff);
router.post("/manager/create", UserController.createManager);
router.patch("/approve/:id", UserController.approveUser);
router.get("/pending", UserController.listPending);

export default router;
