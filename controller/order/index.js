import express from "express"
import { orderModel } from "../../models/order";

const router = express.Router();

// Create Order
router.post("/", async (req, res) => {
  try {
    const {
      contactInfo,
      billingAddress,
      shippingAddress,
      shippingMethod,
      shippingCost,
      totalPrice,
    } = req.body;

    const newOrder = new orderModel({
      contactInfo,
      billingAddress,
      shippingAddress: shippingAddress.sameAsBilling
        ? { ...billingAddress, sameAsBilling: true }
        : shippingAddress,
      shippingMethod,
      shippingCost,
      paymentMethod: "Cash on Delivery",
      totalPrice,
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get All Orders
router.get("/", async (req, res) => {
  try {
    const orders = await orderModel.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Order by ID
router.get("/:id", async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Order Status
router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const order = await orderModel.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete Order
router.delete("/:id", async (req, res) => {
  try {
    const order = await orderModel.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
