import express from "express";
const ProductCategoryRoute = express.Router();
import { IsLoggedIn } from "../middlewares/auth.middleware.js";
import IsAdmin from "../middlewares/role.middleware.js";

import { CreateProductCategory, GetAllProductCategories } from "../controllers/productCategory.controller.js";

ProductCategoryRoute.get("/", IsLoggedIn, GetAllProductCategories);
ProductCategoryRoute.post("/", IsLoggedIn, IsAdmin, CreateProductCategory);

export default ProductCategoryRoute;
