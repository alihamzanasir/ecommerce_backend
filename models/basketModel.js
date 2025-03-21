import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    highlight: { type: String, required: true },
    price: { type: Number, required: true },
    actualPrice: { type: Number, required: true }, // Changed to Number
    warranty: { type: String, required: true },
    packageWeight: { type: Number, required: true }, // Changed name & type
    stock: { type: Number, required: true },
    promotionImage: { type: String, required: true },
    productImages: { type: [String], required: true }, // Changed type
    video: { type: String }, // Optional
    category: { type: String, required: true },
    size: { type: String },
    brand: { type: String }, // Optional
    sku: { type: String, unique: true }, // Optional for tracking
    tags: { type: [String] }, // Optional for search optimization
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  },
  { timestamps: true }
);
const basketSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, required: true, min: 1 },
    },
  ],
});
const Product = mongoose.model("product", productSchema);
const Basket = mongoose.model("basket", basketSchema);

export { Product, Basket };
