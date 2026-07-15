import express from "express";

const UserRoute = express.Router();
import { IsLoggedIn, IsAdmin } from "../middlewares/auth.middleware.js";
import {
  GetAllUsers,
  GetUserProfile,
  RegisterUser,
  LoginUser,
  LogoutUser,
  DeleteUser,
  UpdateUser

} from "../controllers/user.controller.js";

// admin only
UserRoute.get("/all", IsLoggedIn, IsAdmin, GetAllUsers);
UserRoute.delete("/:userId",  IsLoggedIn, IsAdmin, DeleteUser);


// public only
UserRoute.get("/profile/:userId", IsLoggedIn, GetUserProfile);
UserRoute.post("/register", RegisterUser);
UserRoute.post("/login",  LoginUser);
UserRoute.post("/logout",  IsLoggedIn, LogoutUser);
UserRoute.post("/update/:userId", IsLoggedIn, UpdateUser)

// TODO: upcoming routes
// UserRoute.post("/forgotPassword", IsLoggedIn, ForgotPassword)

export default UserRoute;
