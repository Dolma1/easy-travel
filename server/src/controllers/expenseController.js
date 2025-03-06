import Expense from "../models/ExpenseModel.js";
import TravelGroup from "../models/TravelGroupModel.js";
import User from "../models/UserModel.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import cloudinary from "cloudinary";

class ExpenseController {
  static createExpense = asyncHandler(async (req, res, next) => {
    const { groupId, description, amount, category, status, receipt } =
      req.body;

    const paidBy = req.user._id;
    try {
      // Validate required fields
      if (
        !groupId ||
        !description ||
        !amount ||
        !category ||
        !paidBy ||
        !status
      ) {
        return next(new ErrorHandler("All fields are required", 400));
      }

      // Find the group
      const group = await TravelGroup.findById(groupId);
      if (!group) {
        return next(new ErrorHandler("Group not found", 404));
      }

      // TODO: Handle Split between functionality

      // Upload the image to Cloudinary
      let uploadedImage = {
        public_id: "",
        url: "",
      };
      const receptImage = receipt[0];
      if (receptImage) {
        const result = await cloudinary.v2.uploader.upload(receptImage, {
          folder: "receipts", // Optional: Save images in a specific folder
          resource_type: "auto", // Automatically detect the file type
        });
        uploadedImage = {
          public_id: result.public_id,
          url: result.secure_url,
        };
      }

      // Create the expense
      const expense = await Expense.create({
        group: groupId,
        description,
        amount: amount,
        category,
        paidBy,
        status,
        receipt: uploadedImage,
      });

      // Update group's total expenses
      group.totalExpenses += amount;
      await group.save();

      res.status(201).json({
        success: true,
        message: "Expense added successfully",
        data: expense,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

  static updateExpense = asyncHandler(async (req, res, next) => {
    const expenseId = req.params.id;
    const { description, amount, category, splitBetween } = req.body;
    const userId = req.user._id;

    try {
      // Find the expense
      const expense = await Expense.findById(expenseId);
      if (!expense) {
        return next(new ErrorHandler("Expense not found", 404));
      }

      // Check if the user is the payer or an admin
      const group = await TravelGroup.findById(expense.group);
      const isAdmin = group.members.some(
        (member) =>
          member.user.toString() === userId.toString() &&
          member.role === "admin"
      );
      if (expense.paidBy.user.toString() !== userId.toString() && !isAdmin) {
        return next(
          new ErrorHandler("You are not authorized to update this expense", 403)
        );
      }

      // Update the expense
      if (description) expense.description = description;
      if (amount) expense.amount = amount;
      if (category) expense.category = category;
      if (splitBetween) expense.splitBetween = splitBetween;

      await expense.save();

      res.status(200).json({
        success: true,
        message: "Expense updated successfully",
        data: expense,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

  static deleteExpense = asyncHandler(async (req, res, next) => {
    const expenseId = req.params.id;
    const userId = req.user._id;

    try {
      // Find the expense
      const expense = await Expense.findById(expenseId);
      if (!expense) {
        return next(new ErrorHandler("Expense not found", 404));
      }

      // Check if the user is the payer or an admin
      const group = await TravelGroup.findById(expense.group);
      const isAdmin = group.members.some(
        (member) =>
          member.user.toString() === userId.toString() &&
          member.role === "admin"
      );
      if (expense.paidBy.user.toString() !== userId.toString() && !isAdmin) {
        return next(
          new ErrorHandler("You are not authorized to delete this expense", 403)
        );
      }

      // Delete the expense
      await Expense.findByIdAndDelete(expenseId);

      // Update group's total expenses
      group.totalExpenses -= expense.amount.value;
      await group.save();

      res.status(200).json({
        success: true,
        message: "Expense deleted successfully",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

  static fetchExpenses = asyncHandler(async (req, res, next) => {
    const { groupId } = req.query; // Use query params instead of body for GET requests

    try {
      // Find the group
      const group = await TravelGroup.findById(groupId);
      if (!group) {
        return next(new ErrorHandler("Group not found", 404));
      }

      // Fetch all expenses for the group
      const expenses = await Expense.find({ group: groupId })
        .populate("paidBy.user", "name email")
        .populate("splitBetween.user", "name email");

      res.status(200).json({
        success: true,
        count: expenses.length,
        data: expenses,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

  static fetchSingleExpense = asyncHandler(async (req, res, next) => {
    const expenseId = req.params.id;

    try {
      // Find the expense
      const expense = await Expense.findById(expenseId)
        .populate("paidBy.user", "name avatar")
        .populate("splitBetween.user", "name avatar");

      if (!expense) {
        return next(new ErrorHandler("Expense not found", 404));
      }

      res.status(200).json({
        success: true,
        data: expense,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });
}

export default ExpenseController;
