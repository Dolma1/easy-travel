import express from "express";
import JournalController from "../controllers/journalController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const journalRouter = express.Router();

journalRouter.post("/", isAuthenticated, JournalController.createJournal);

journalRouter.get("/", isAuthenticated, JournalController.getAllJournal);

journalRouter.get("/public-journal", isAuthenticated, JournalController.getExploreJournals);

journalRouter.put("/:id", isAuthenticated, JournalController.updateJournal);

journalRouter.delete("/:id", isAuthenticated, JournalController.deleteJournal);

journalRouter.get("/:id", isAuthenticated, JournalController.getSingleJournal);

export default journalRouter;
