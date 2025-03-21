import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    contactInfo: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      phoneNumber: { type: String, required: true },
    },
    billingAddress: {
      streetAddress: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    shippingAddress: {
      sameAsBilling: { type: Boolean, required: true },
      streetAddress: { type: String },
      city: { type: String },
      state: { type: String },
      zipCode: { type: String },
      country: { type: String },
    },
    shippingMethod: {
      type: String,
      enum: ["Standard Shipping", "Express Shipping", "Overnight Shipping"],
      required: true,
    },
    shippingCost: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["Cash on Delivery"],
      default: "Cash on Delivery",
    },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "shipped", "delivered"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const orderModel = mongoose.model("Order", orderSchema);
