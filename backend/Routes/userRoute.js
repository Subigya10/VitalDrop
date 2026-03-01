import express from "express";
import { register, getAll, getById, updateById, deleteById, getDonors } from "../Controller/userController.js";
import { verifyToken } from "../Middleware/authmiddleware.js";
import upload from "../Middleware/multerconfig.js"; // ← add this (adjust path if needed)

export const router = express.Router();

router.get("/donors", verifyToken, getDonors);
router.get("/", getAll);
router.get("/:id", getById);
router.patch("/:id", updateById);
router.delete("/:id", deleteById);
router.post("/", upload.single("profilePhoto"), register); // ← added multer here