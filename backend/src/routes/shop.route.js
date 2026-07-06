import express from "express";
const ShopRoute = express.Router();
import { IsLoggedIn } from "../middlewares/auth.middleware.js";

import {
  CreateMerchantShop,
  GetMerchantShopDetails,
  GetAllMerchantShops,
} from "../controllers/shop.controller.js";

ShopRoute.get("/", IsLoggedIn, GetAllMerchantShops);
ShopRoute.get("/:id", IsLoggedIn, GetMerchantShopDetails);

ShopRoute.post("/", IsLoggedIn, CreateMerchantShop);
// ShopRoute.post("/:id", IsLoggedIn, UpdateMerchantShop)
// ShopRoute.delete("/:id", IsLoggedIn, DeleteMerchantShop)

export default ShopRoute;
