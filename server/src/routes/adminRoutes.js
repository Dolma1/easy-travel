import express from "express";
import AdminController from "../controllers/adminController.js";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth.js";

const adminRouter = express.Router();

adminRouter.get(
  "/",
  isAuthenticated,
  authorizeRoles("admin"),
  AdminController.getDashboardData
);

adminRouter.get(
  "/get-users",
  isAuthenticated,
  authorizeRoles("admin"),
  AdminController.getAllUsers
);

adminRouter.get(
  "/get-journals",
  isAuthenticated,
  // authorizeRoles("admin"),
  AdminController.getAllJournals
);

adminRouter.get(
  "/get-groups",
  isAuthenticated,
  authorizeRoles("admin"),
  AdminController.getAllGroups
);

adminRouter.get(
  "/get-settlements",
  isAuthenticated,
  authorizeRoles("admin"),
  AdminController.getAllSettlements
);

adminRouter.put(
  "/ban-user/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  AdminController.banUserByAdmin
);

adminRouter.delete(
  "/remove-journal/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  AdminController.removeJournal
);

adminRouter.post(
  "/add-user",
  isAuthenticated,
  authorizeRoles("admin"),
  AdminController.addUserByAdmin
);
export default adminRouter;
