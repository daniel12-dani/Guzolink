import express from "express";
const ShopRoute = express.Router();
import { IsLoggedIn } from "../middlewares/auth.middleware.js";

import {
  CreateMerchantShop,
  GetMerchantShopDetails,
  GetMerchantShops,
  DeleteMerchantShop,
  UpdateMerchantShop,
  GetAllShops
} from "../controllers/shops.controller.js";

ShopRoute.get("/all", GetAllShops);
ShopRoute.get("/", IsLoggedIn, GetMerchantShops);
ShopRoute.get("/:id", IsLoggedIn, GetMerchantShopDetails);
ShopRoute.post("/", IsLoggedIn, CreateMerchantShop);
ShopRoute.delete("/:id", IsLoggedIn, DeleteMerchantShop)
ShopRoute.put("/:id", IsLoggedIn, UpdateMerchantShop)
  
export default ShopRoute;
