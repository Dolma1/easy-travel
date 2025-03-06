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

travelGroupRouter.get(
  "/all-expenses/:id",
  isAuthenticated,
  TravelGroupController.fetchGroupExpenses
);

travelGroupRouter.post(
  "/invite-code/:id",
  isAuthenticated,
  TravelGroupController.getGroupInvitationCode
);

travelGroupRouter.post(
  "/verify-code",
  isAuthenticated,
  TravelGroupController.verifyJoinGroupCode
);

travelGroupRouter.post(
  "/join",
  isAuthenticated,
  TravelGroupController.joinGroup
);

export default travelGroupRouter;
