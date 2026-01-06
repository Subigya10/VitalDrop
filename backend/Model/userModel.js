import { sequelize } from "../Database/db.js";
import { DataTypes } from "sequelize";

export const Users = sequelize.define("users", {
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phoneNumber: { 
    type: DataTypes.STRING, 
    allowNull: true 
  },
  address: { 
    type: DataTypes.STRING, 
    allowNull: true 
  },
  gender: { 
    type: DataTypes.STRING, 
    allowNull: true 
  },
  bloodGroup: { 
    type: DataTypes.STRING, 
    allowNull: true 
  },
  medicalHistory: { 
    type: DataTypes.STRING, 
    allowNull: true 
  },
  dateOfBirth: { 
    type: DataTypes.DATEONLY, 
    allowNull: true 
  },

    role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "user" // <-- all new signups are normal users
  
  },
});
