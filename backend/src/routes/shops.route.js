import express from "express";
const ShopRoute = express.Router();
import { IsLoggedIn } from "../middlewares/auth.middleware.js";

import {
  CreateMerchantShop,
  GetMerchantShopDetails,
  GetAllMerchantShops,
  GetAllShops,
  DeleteMerchantShop
} from "../controllers/shops.controller.js";

ShopRoute.get("/all",  GetAllShops);

ShopRoute.get("/", IsLoggedIn, GetAllMerchantShops);
ShopRoute.get("/:id", IsLoggedIn, GetMerchantShopDetails);
ShopRoute.post("/", IsLoggedIn, CreateMerchantShop);
// ShopRoute.delete("/:id", IsLoggedIn, DeleteMerchantShop)

// ShopRoute.post("/:id", IsLoggedIn, UpdateMerchantShop)

export default ShopRoute;
