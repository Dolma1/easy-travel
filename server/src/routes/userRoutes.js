import express from "express";
import UserController from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const userRouter = express.Router();

userRouter.post("/register", UserController.registerUser);

userRouter.post("/activate", UserController.activateUser);

userRouter.post("/login", UserController.loginUser);

userRouter.post("/logout", isAuthenticated, UserController.logoutUser);

userRouter.get("/profile", isAuthenticated, UserController.getUserDetails);

export default userRouter;
