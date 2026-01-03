import { DataTypes } from "sequelize";
import { sequelize } from "../Database/db.js";

export const Products = sequelize.define("products", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  name: { // e.g., "A+ Blood Unit", "O- Blood Unit", "Oxygen Cylinder"
    type: DataTypes.STRING,
    allowNull: false,
  },

  type: { // Blood, Medicine, Oxygen, Equipment, etc.
    type: DataTypes.STRING,
    allowNull: false,
  },

  quantity: { // Number of units available
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  location: { // Hospital or center where it’s available
    type: DataTypes.STRING,
    allowNull: false,
  },

  expiryDate: { // Optional, for blood or medicine
    type: DataTypes.DATEONLY,
    allowNull: true,
  },

  description: { // Optional extra info
    type: DataTypes.STRING,
    allowNull: true,
  },
});
