import mongoose from "mongoose";

const products = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const basketSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart",
        required: true,
      },
      quantity: { type: Number, required: true, min: 1 },
    },
  ],
});
const Cart = mongoose.model("Cart", products);
const Basket = mongoose.model("basket", basketSchema);

export { Cart, Basket };
