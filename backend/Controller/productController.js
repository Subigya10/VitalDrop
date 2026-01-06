import { Products } from "../Model/productModel.js";

/* GET ALL PRODUCTS */
export const getAllProducts = async (req, res) => {
  try {
    const products = await Products.findAll();
    res.status(200).send({
      data: products,
      message: "Products fetched successfully",
    });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};

/* CREATE PRODUCT */
export const saveProduct = async (req, res) => {
  try {
    const { name, type, quantity, location, expiryDate, description } = req.body;

    if (!name || !type || !quantity || !location) {
      return res.status(400).send({
        message: "Required fields are missing",
      });
    }

    const product = await Products.create({
      name,
      type,
      quantity,
      location,
      expiryDate,
      description,
    });

    res.status(201).send({
      message: "Product saved successfully",
      data: product,
    });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};

/* GET PRODUCT BY ID */
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Products.findOne({ where: { id } });

    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    res.status(200).send({
      data: product,
      message: "Product fetched successfully",
    });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};

/* UPDATE PRODUCT */
export const updateProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const product = await Products.findOne({ where: { id } });

    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    product.name = body.name ?? product.name;
    product.type = body.type ?? product.type;
    product.quantity = body.quantity ?? product.quantity;
    product.location = body.location ?? product.location;
    product.expiryDate = body.expiryDate ?? product.expiryDate;
    product.description = body.description ?? product.description;

    await product.save();

    res.status(200).send({
      message: "Product updated successfully",
      data: product,
    });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};

/* DELETE PRODUCT */
export const deleteProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Products.findOne({ where: { id } });

    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    await product.destroy();

    res.status(200).send({
      message: "Product deleted successfully",
      data: product,
    });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};


/* GET ALL PRODUCTS - ADMIN ONLY */
export const getAdminProducts = async (req, res) => {
  try {
    const userRole = req.user.role; // comes from JWT middleware

    if (userRole !== "admin") {
      return res.status(403).send({ message: "Forbidden: Admins only" });
    }

    const products = await Products.findAll(); // fetch all products
    res.status(200).send({
      data: products,
      message: "Admin products fetched successfully",
    });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};
