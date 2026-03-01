import { DataTypes } from "sequelize";
import { sequelize } from "../Database/db.js";
import { Users } from "./userModel.js";

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

// Association — links Donation.userId → Users.userId
Donation.belongsTo(Users, { foreignKey: "userId" });
Users.hasMany(Donation, { foreignKey: "userId" });