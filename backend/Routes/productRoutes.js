import express from "express";
import {
  getAllProducts,
  getProductById,
  saveProduct,
  updateProductById,
  deleteProductById,
} from "../Controller/productController.js";

export const productRouter = express.Router();

productRouter.get("/", getAllProducts);
productRouter.get("/:id", getProductById);
productRouter.post("/", saveProduct);
productRouter.patch("/:id", updateProductById);
productRouter.delete("/:id", deleteProductById);
