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
  deleteBasketProduct
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


  // live
basketRouter.get("/user/products", allProduct);
basketRouter.get("/user/productDetails/:id", productDetail);

basketRouter.post("/user/addtocart", authenticateUser, addbasket);
basketRouter.get("/user/basketProduct",authenticateUser, getBasketProduct);

basketRouter.delete("/user/basketProduct/:id",authenticateUser,deleteBasketProduct)

export { basketRouter };
