import express from "express";
import TravelGroupController from "../controllers/travelgroupController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const travelGroupRouter = express.Router();

travelGroupRouter.post("/", isAuthenticated, TravelGroupController.createGroup);

travelGroupRouter.get("/", isAuthenticated, TravelGroupController.fetchGroups);

travelGroupRouter.put(
  "/:id",
  isAuthenticated,
  TravelGroupController.addOrRemoveMembers
);

travelGroupRouter.delete(
  "/:id",
  isAuthenticated,
  TravelGroupController.deleteGroup
);

travelGroupRouter.get(
  "/:id",
  isAuthenticated,
  TravelGroupController.fetchSingleGroup
);

export default travelGroupRouter;
