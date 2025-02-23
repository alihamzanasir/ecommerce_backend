import { Cart, Basket } from "../../models/basketModel.js";

const basket = async (req, res) => {
  try {
    const { title, description, price } = req.body;

    console.log(req.file);

    if (!title || !description || !req.file.path || !price) {
      return res
        .status(400)
        .json({ message: "title and description is required" });
    }

    const newItem = await Cart.create({
      title,
      description,
      image: req.file.path,
      price,
    });

    await newItem.save();
    return res.status(201).json({ message: "create new Item sucessfully" });
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
    await Cart.findByIdAndDelete(id);

    return res.status(200).json({ message: "Item Delete Successfully" });
  } catch (error) {}
};

const updateBasketItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Update id is required" });
    }
    if (!title && !description) {
      return res.status(400).json({ message: "No fields to update provided" });
    }

    const updatedDocument = await Cart.findByIdAndUpdate(
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


export { basket, deleteBasketItem, updateBasketItem };
