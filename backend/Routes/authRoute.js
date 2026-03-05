import express from "express";
import { login, forgotPassword,resetPassword } from "../Controller/authController.js";
import { verifyToken } from "../Middleware/authmiddleware.js";
import { authController } from "../Controller/authController.js";

export const authRouter = express.Router();
authRouter.post("/login", login);
authRouter.post("/forgotpass", forgotPassword);
authRouter.post("/resetpass/:token", resetPassword);                         
authRouter.get("/init", verifyToken, authController.init);
