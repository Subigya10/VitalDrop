import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
    "postgres",
    "postgres",
    "iamsubi10@",
    {
        "host": "localhost",
        "dialect": "postgres",
    }
);
 // connects node.js to postgresql

export const connection = () => {
    try {
        sequelize.sync(); // automatically creates table based on model
        console.log("Database connected");
    } catch (e) {
        console.log("Database connection failed", e);        
    }
 }
