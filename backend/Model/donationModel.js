import { DataTypes } from "sequelize";
import { sequelize } from "../Database/db.js"; // ← fix this line

export const Donation = sequelize.define("Donation", {
  donorName: { type: DataTypes.STRING, allowNull: false },
  bloodGroup: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  hospital: { type: DataTypes.STRING, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  status: { 
    type: DataTypes.ENUM("scheduled", "completed", "cancelled"), 
    defaultValue: "scheduled" 
  }
}, { timestamps: true, tableName: "Donations" });