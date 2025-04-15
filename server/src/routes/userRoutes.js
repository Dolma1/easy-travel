import express from "express";
import UserController from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const userRouter = express.Router();

userRouter.post("/register", UserController.registerUser);

userRouter.post("/activate", UserController.activateUser);

userRouter.post("/login", UserController.loginUser);

userRouter.post("/logout", isAuthenticated, UserController.logoutUser);

userRouter.get("/profile", isAuthenticated, UserController.getUserProfile);
userRouter.get(
  "/dashboard-data",
  isAuthenticated,
  UserController.getDashboardData
);
userRouter.get("/get-settlements", isAuthenticated, UserController.getSettlements)
userRouter.put(
  "/update-profile",
  isAuthenticated,
  UserController.updateUserDetails
);

export default userRouter;
