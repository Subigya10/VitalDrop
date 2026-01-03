import express from "express";
import { login } from "../Controller/authController.js";

export const authRouter = express.Router();

authRouter.post("/login", login);
