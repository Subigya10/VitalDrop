import express from "express";
import { register, getAll, getById, updateById, deleteById } from "../Controller/userController.js";

export const router = express.Router();

router.get("/", getAll);
router.get("/:id", getById);
router.patch("/:id", updateById);
router.delete("/:id", deleteById);
router.post("/", register);
