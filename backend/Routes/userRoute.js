import express from "express";
import { register, getAll, getById, updateById, deleteById, getDonors } from "../Controller/userController.js";
import { verifyToken } from "../Middleware/authmiddleware.js";

export const router = express.Router();

router.get("/donors", verifyToken, getDonors); // ← must be BEFORE /:id
router.get("/", getAll);
router.get("/:id", getById);
router.patch("/:id", updateById);
router.delete("/:id", deleteById);
router.post("/", register);