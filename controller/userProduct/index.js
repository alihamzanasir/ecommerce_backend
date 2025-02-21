import { AddToCart, Cart } from "../../models/basketModel.js";

const allProduct = async (req,res) => {
  try {
    const products = await Cart.find({});

    return res.status(200).json({ status: true, data: products });
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
    const { productId } = req.body;

    if (!req.user._id) {
      return res.status(401).json({ message: "userId Not found" });
    }

    const isItemExit = await Cart.findById(productId);

    if (!isItemExit) {
      return res.status(404).json({ message: "Item not found" });
    }

    const addProduct = await AddToCart.create({
      userId: req.user._id,
      products: [productId],
    });

    await addProduct.save();
    return res.status(201).json({ message: "item add successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

const getBasketProduct = async () => {
  try {
    const userId = req.user._id;

    const activeUserBasketData = AddToCart.findById(userId);

    if (!activeUserBasketData) {
      return res.status(200).json({ message: "Basket is empty" });
    }
                                                    
    console.log(activeUserBasketData);
    return res
      .status(200)
      .json({ message: "successfull", data: activeUserBasketData });
  } catch (error) {}
};

export { addbasket, getBasketProduct, allProduct, productDetail };
