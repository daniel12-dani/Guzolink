import express from "express";

const UserRoute = express.Router();
import { IsLoggedIn } from "../middlewares/auth.middleware.js";
import IsAdmin from "../middlewares/role.middleware.js";
import {
	GetAllUsers,
	GetUserProfile,
	RegisterUser,
	LoginUser,
	DeleteUser,
} from "../controllers/user.controller.js";

UserRoute.get("/all", IsLoggedIn, IsAdmin, GetAllUsers);
UserRoute.get("/:id", IsLoggedIn, GetUserProfile);
UserRoute.post("/register", RegisterUser);
UserRoute.post("/regr", RegisterUser);
UserRoute.post("/login", LoginUser);
UserRoute.delete("/", DeleteUser);

export default UserRoute;
