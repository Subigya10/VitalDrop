import express from "express";
import { connection } from "./Database/db.js";
import { router as userRouter } from "./Routes/userRoute.js";
import { authRouter } from "./Routes/authRoute.js";
import { productRouter } from "./Routes/productRoutes.js";
import cors from "cors";
const app = express();

// Connect database
connection();

// Middleware
app.use(cors({
  origin: "http://localhost:5178"
}));

app.use(express.json());

// Routes
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/product", productRouter);

// Test route
app.get("/", (req, res) => res.send("Blood group and emergency contact API is running"));

// Start server
app.listen(5000, () => console.log("Server running on http://localhost:5000"));
