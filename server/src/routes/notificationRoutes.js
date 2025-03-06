import express from "express";
import TravelGroupController from "../controllers/travelgroupController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const notificationRouter = express.Router();

notificationRouter.post("/", isAuthenticated, TravelGroupController.createGroup);

notificationRouter.get("/", isAuthenticated, TravelGroupController.fetchGroups);

notificationRouter.put(
  "/:id",
  isAuthenticated,
  TravelGroupController.addOrRemoveMembers
);

notificationRouter.delete(
  "/:id",
  isAuthenticated,
  TravelGroupController.deleteGroup
);

notificationRouter.get(
  "/:id",
  isAuthenticated,
  TravelGroupController.fetchSingleGroup
);

notificationRouter.get(
  "/all-expenses/:id",
  isAuthenticated,
  TravelGroupController.fetchGroupExpenses
);
export default notificationRouter;
