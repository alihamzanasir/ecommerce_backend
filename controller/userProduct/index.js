import { Basket, Cart } from "../../models/basketModel.js";

const allProduct = async (req, res) => {
  try {
    const products = await Cart.find({}).lean();

    const updatedProducts = products.map((item) => ({
      ...item,
      image: `${"https://ecommerce-backend-3u6d.vercel.app/"}${item.image}`,
    }));
    return res.status(200).json({ status: true, data: updatedProducts });
  } catch (error) {}
};

const productDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const productDetail = await Cart.findById(id);
    res.status(200).json({ status: true, data: productDetail });
  } catch (error) {}
};

const addbasket = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    let cart = await Basket.findOne({ userId });

    if (!cart) {
      cart = new Basket({ userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getBasketProduct = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Basket.findOne({ userId }).populate("items.productId");

    if (!cart) {
      return res.json({
        success: true,
        cart: { userId, items: [], totalProducts: 0 },
      });
    }

    const totalProducts = cart.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    res.json({ success: true, cart: { ...cart.toObject(), totalProducts } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteBasketProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    let cart = await Basket.findOne({ userId });

    if (!cart)
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });

    cart.items = cart.items.filter((item) => item.productId.toString() !== id);

    await cart.save();
    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  addbasket,
  getBasketProduct,
  deleteBasketProduct,
  allProduct,
  productDetail,
};
