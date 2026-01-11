import { Users } from "../model/userModel.js";
import { generateToken } from "../Security/jwt-utils.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config(); // load .env variables



export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and Password are required" });

    const user = await Users.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Password is incorrect" });

    const { password: _, ...userWithoutPassword } = user.toJSON();
    const token = generateToken({ user: userWithoutPassword });

   res.status(200).json({
  access_token: token,
  message: "Token generated successfully",
  user: {
    userId: user.userId,
    email: user.email,
    role: user.role,
  },
});

  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await Users.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate a secure reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 3600 * 1000; // 1 hour expiry

    // Save token and expiry in DB
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

      console.log("ENV EMAIL_USER:", process.env.EMAIL_USER); // shows which Gmail Nodemailer is using
    console.log("Sending email to:", user.email);           // shows which user will receive it


    // Send email with nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetURL = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Request",
      html: `<p>You requested a password reset.</p>
             <p>Click this link to reset your password: <a href="${resetURL}">${resetURL}</a></p>
             <p>This link will expire in 1 hour.</p>`,
    });

    res.status(200).json({ message: "Reset link sent to your email" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};