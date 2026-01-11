import express from "express";
import { login, forgotPassword } from "../Controller/authController.js";

export const authRouter = express.Router();

authRouter.post("/login", login);
authRouter.post("/forgotpass", forgotPassword);

