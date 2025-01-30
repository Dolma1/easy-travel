import express from "express";
import ExpenseController from "../controllers/expenseController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const expenseRouter = express.Router();

expenseRouter.post("/", isAuthenticated, ExpenseController.createExpense);

expenseRouter.get("/", isAuthenticated, ExpenseController.fetchExpenses);

expenseRouter.put("/:id", isAuthenticated, ExpenseController.updateExpense);

expenseRouter.delete("/:id", isAuthenticated, ExpenseController.deleteExpense);

expenseRouter.get(
  "/:id",
  isAuthenticated,
  ExpenseController.fetchSingleExpense
);

export default expenseRouter;
