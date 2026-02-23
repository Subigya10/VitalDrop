import { DataTypes } from "sequelize";
import { sequelize } from "../Database/db.js";

export const BloodRequests = sequelize.define("BloodRequests", {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  // ADD THIS FIELD BELOW
//   requesterId: {
//     type: DataTypes.INTEGER,
//     allowNull: false // Every request must belong to a user
//   },
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
    allowable: false 
  },
  status: { 
    type: DataTypes.STRING, 
    defaultValue: "pending" 
  },
}, {
  timestamps: true 
});