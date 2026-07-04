import UserRoute from "./user.route.js";

export default function RegisterRoutes(app) {
	console.log(`Registering routes: `);
	app.use("/api/user", UserRoute);
}
