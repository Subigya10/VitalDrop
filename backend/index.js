import express from "express";
import { connection } from "./Database/db.js";
import { router as userRouter } from "./Routes/userRoute.js";
import { authRouter } from "./Routes/authRoute.js";
import { productRouter } from "./Routes/productRoutes.js";
import cors from "cors";
import { createUploadsFolder } from "./Security/helper.js"; 
import uploadRouter from "./Routes/uploadRoutes.js";
import dotenv from "dotenv";
import { requestRouter } from "./Routes/requestRoute.js";

dotenv.config();

console.log("JWT_SECRET:", process.env.JWT_SECRET);

const app = express();

app.use(cors({
  origin: "http://localhost:5177"
}));

app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/product", productRouter);
app.use("/api/file", uploadRouter);
app.use("/api/requests", requestRouter);

createUploadsFolder();

app.get("/", (req, res) => res.send("Blood group and emergency contact API is running"));

const startServer = async () => {
  await connection();
  app.listen(5000, () => console.log("Server running on http://localhost:5000"));
};

startServer();