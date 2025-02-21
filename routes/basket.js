import { Router } from "express";
import { multerImages } from "../lib/index.js";
import {
  basket,
  deleteBasketItem,
  updateBasketItem,
} from "../controller/adminProduct/index.js";
import authenticateUser from "../middleware/authenticateUser.js";
import {
  addbasket,
  getBasketProduct,
  allProduct,
  productDetail,
} from "../controller/userProduct/index.js";

const basketRouter = Router();

// admin view

basketRouter.post(
  "/admin/product",
  // authenticateUser,
  multerImages.single("file"),
  basket
);
basketRouter.delete("/admin/product/:id", authenticateUser, deleteBasketItem);
basketRouter.patch(
  "/admin/product/:id",
  authenticateUser,
  multerImages.single("file"),
  updateBasketItem
);

// user view

basketRouter.get("/user/allProduct", allProduct);
basketRouter.post("/user/addProduct", authenticateUser, addbasket);
basketRouter.get("/user/product", getBasketProduct);
basketRouter.get("/user/productDetails/:id", productDetail);

export { basketRouter };
