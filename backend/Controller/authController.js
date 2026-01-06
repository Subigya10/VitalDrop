import { Users } from "../model/userModel.js";
import { generateToken } from "../Security/jwt-utils.js";
import bcrypt from "bcryptjs";

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
