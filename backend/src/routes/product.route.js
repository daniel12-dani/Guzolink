import express from "express";
import { IsLoggedIn } from "../middlewares/auth.middleware.js";
import {
  GetAllShopProducts,
  GetAllMerchantShopProducts,
  CreateMerchantShopProduct,
  UpdateMerchantShopProduct,
  DeleteMerchantShopProducts,
} from "../controllers/product.controller.js";

const ProductRoute = express.Router();

// for all customers
ProductRoute.get("/all-shop-products", GetAllShopProducts);

// for shop owners
ProductRoute.get("/shop/:shopId", IsLoggedIn, GetAllMerchantShopProducts);
ProductRoute.post("/", IsLoggedIn, CreateMerchantShopProduct);
ProductRoute.post("/:id", IsLoggedIn, UpdateMerchantShopProduct);
ProductRoute.delete("/:id", IsLoggedIn, DeleteMerchantShopProducts);

export default ProductRoute;
