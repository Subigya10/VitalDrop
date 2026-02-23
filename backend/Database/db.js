// db.js
import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
    "VitalDrop",
    "postgres",
    "iamsubi10@",
    {
        host: "localhost",
        dialect: "postgres",
    }
);

export const connection = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ alter: true });
        console.log("Database connected and synced!");
    } catch (e) {
        console.log("Database connection failed", e);        
    }
}