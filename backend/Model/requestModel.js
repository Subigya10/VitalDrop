import { DataTypes } from "sequelize";
import { sequelize } from "../Database/db.js";

export const BloodRequests = sequelize.define("BloodRequests", {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  // The person who needs the blood
  requesterId: {
    type: DataTypes.INTEGER,
    allowNull: false 
  },
  // The person who volunteers to give (starts as null)
  donorId: {
    type: DataTypes.INTEGER,
    allowNull: true 
  },
  patientName: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  bloodGroup: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  unitsNeeded: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  hospitalLocation: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  status: { 
    type: DataTypes.STRING, 
    defaultValue: "pending" 
  },
  urgency: {
  type: DataTypes.STRING,
  defaultValue: "normal"
},
}, {
  timestamps: true 
});