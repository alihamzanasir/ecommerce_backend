import { Product } from "../../models/basketModel.js";
import fs from "fs";

const basket = async (req, res) => {
  try {
    const {
      name, //
      description,
      highlight,
      price, //
      actualPrice, //
      warranty, //
      packageWeight, //
      stock, //
      category, //
      sku,
      size,
    } = req.body;
    const userId = req.user._id;
    // Handle Uploaded Files
    const promotionImage = req.files["promotionImage"]
      ? req.files["promotionImage"][0].path
      : null;
    const productImages = req.files["productImages"]
      ? req.files["productImages"].map((file) => file.path)
      : [];
    const video = req.files["video"] ? req.files["video"][0].path : null;

    // Create New Product
    const newProduct = new Product({
      name,
      description,
      highlight,
      sku,
      price,
      actualPrice,
      warranty,
      packageWeight,
      stock,
      category,
      promotionImage,
      productImages,
      video,
      userId,
      ...(size && { size }),
    });

    await newProduct.save();
    res
      .status(201)
      .json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    if (req.files) {
      Object.values(req.files).forEach((fileArray) => {
        fileArray.forEach((file) => {
          fs.unlinkSync(file.path);
        });
      });
    }

    res
      .status(500)
      .json({ message: "Error adding product", error: error.message });
  }
};

const manageProduct = async (req, res) => {
  try {
    const products = await Product.find({});

    res.status(200).json({
      message: "product get succcessfully",
      status: true,
      data: products,
    });
  } catch (error) {}
};

const deleteBasketItem = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ message: "delete id is required" });
    }
    if (!id) {
      return res.status(400).json({ message: "delete id is required" });
    }
    await Product.findByIdAndDelete(id);

    return res.status(200).json({ message: "Item Delete Successfully" });
  } catch (error) {}
};

const updateBasketItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    JSON.stringify

    if (!id) {
      return res.status(400).json({ message: "Update id is required" });
    }
    if (!title && !description) {
      return res.status(400).json({ message: "No fields to update provided" });
    }

    const updatedDocument = await Product.findByIdAndUpdate(
      id,
      { title, description },
      { new: true, runValidators: true }
    );

    if (!updatedDocument) {
      return res.status(404).json({ message: "Document not found" });
    }

    return res.status(200).json({
      message: "Document updated successfully",
      updatedDocument,
    });
    
  } catch (error) {}
};

export { basket, deleteBasketItem, updateBasketItem, manageProduct };
