import express from  "express"
const ShopRoute = express.Router()
import { IsLoggedIn } from "../middlewares/auth.middleware.js"

import { CreateMerchantShop, GetAllMerchantShops } from "../controllers/shop.controller.js"



ShopRoute.get("/", IsLoggedIn, GetAllMerchantShops)
ShopRoute.post("/", IsLoggedIn, CreateMerchantShop)
// ShopRoute.post("/:id", IsLoggedIn, UpdateMerchantShop)
// ShopRoute.delete("/:id", IsLoggedIn, DeleteMerchantShop)


export default ShopRoute