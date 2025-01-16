import express from "express";
import {
  createJournal,
  getJournal
} from "../controllers/journalController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const journalRouter = express.Router()

journalRouter.post('/create-journal', isAuthenticated,createJournal)
journalRouter.get('/get-journal', isAuthenticated,getJournal)
export default journalRouter;