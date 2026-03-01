import { Users } from "../Model/userModel.js";
import bcrypt from "bcryptjs";
import { Op } from "sequelize";

// REGISTER
export const register = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      phoneNumber,
      address,
      gender,
      bloodGroup,
      medicalHistory,
      dateOfBirth,
    } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and Password are required" });

    const existingUser = await Users.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await Users.create({
      fullName,
      email,
      password: hashedPassword,
      phoneNumber,
      address,
      gender,
      bloodGroup,
      medicalHistory,
      dateOfBirth,
      role: "user",
    });

    res.status(201).json({ message: "User registered successfully", data: user });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// GET ALL USERS
export const getAll = async (req, res) => {
  try {
    const users = await Users.findAll();
    res.status(200).json(users);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// GET USER BY ID
export const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Users.findByPk(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// UPDATE USER
export const updateById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Users.findByPk(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    await user.update(req.body);
    res.status(200).json({ message: "User updated successfully", data: user });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// DELETE USER
export const deleteById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Users.findByPk(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.destroy();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// GET ALL DONORS (users with a blood group set)
export const getDonors = async (req, res) => {
  try {
    const donors = await Users.findAll({
      where: {
        bloodGroup: { [Op.not]: null },
      },
      attributes: ['userId', 'fullName', 'bloodGroup', 'phoneNumber', 'address', 'gender'],
      order: [['fullName', 'ASC']],
    });
    res.status(200).json(donors);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};