import dotenv from "dotenv";
dotenv.config();
import { Basket, Product } from "../../models/basketModel.js";

const allProduct = async (req, res) => {
  try {
    const products = await Product.find({}).lean();

    const updatedProducts = products.map((item) => ({
      ...item,
      image: `${process.env.BASE_URL}${item.image}`,
    }));
    return res.status(200).json({ status: true, data: updatedProducts });
  } catch (error) {}
};

const productDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const productDetail = await Product.findById(id);
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
    res.json({ success: true, message: "item add successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getBasketProduct = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 5 } = req.query;

    const cart = await Basket.findOne({ userId })
      .populate("items.productId")
      .lean();

    const totalProducts = cart.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    const totalPrice = cart.items.reduce(
      (sum, item) => sum + parseFloat(item?.productId?.price),
      0
    );
    if (cart) {
      cart.items = cart.items.slice((page - 1) * limit, page * limit);
    }

    if (!cart) {
      return res.json({
        success: true,
        cart: {
          userId,
          items: [],
          totalProducts: 0,
          totalPages: 0,
          currentPage: 1,
        },
      });
    }

    const totalItems = await Basket.aggregate([
      { $match: { userId } },
      { $project: { totalItems: { $size: "$items" } } },
    ]);

    const totalPages = Math.ceil((totalItems[0]?.totalItems || 0) / limit);
    res.json({
      success: true,
      items: cart.items.map((item) => {
        const { _id, title, description, price, image } = item.productId;

        return {
          product: {
            _id,
            title,
            description,
            price,
            image: `${process.env.BASE_URL}/${image}`,
            quantity: item.quantity,
          },
        };
      }),
      totalProducts,
      totalPages,
      currentPage: Number(page),
      totalPrice: parseFloat(totalPrice.toFixed(2)),
    });
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
