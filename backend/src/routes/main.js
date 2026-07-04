import UserRoute from "./user.route.js";
import ShopRoute from "./shop.route.js";
import ProductRoute from "./product.route.js"
import ShopCategoryRoute from "./shopCategory.route.js";

export default function RegisterRoutes(app) {
	console.log(`Registering routes: `);
	app.use("/api/user", UserRoute);
	app.use("/api/shop", ShopRoute);
	app.use("/api/product", ProductRoute);
	app.use("/api/shop-category", ShopCategoryRoute);
}
