import express from "express";
import {
  getAllProducts,
  getProductById,
  saveProduct,
  updateProductById,
  deleteProductById,
} from "../Controller/productController.js";
import { verifyToken } from "../Middleware/authmiddleware.js";
export const productRouter = express.Router();
import { verifyAdmin } from "../Middleware/verifyAdmin.js";
import { getAdminProducts } from "../Controller/productController.js";

productRouter.get("/", getAllProducts);
productRouter.get("/:id", getProductById);
productRouter.post("/", saveProduct);
productRouter.patch("/:id", updateProductById);
productRouter.delete("/:id", deleteProductById);

productRouter.get("/admin/products", verifyToken, getAdminProducts,verifyAdmin);
