import cloudinary from "cloudinary";
import mongoose from "mongoose";
import Expense from "../models/ExpenseModel.js";
import TravelGroup from "../models/TravelGroupModel.js";
import User from "../models/UserModel.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import path from "path";
import { fileURLToPath } from "url";
import sendMail from "../utils/sendMail.js";
import { group } from "console";
import ejs from "ejs";

class ExpenseController {
  static createExpense = asyncHandler(async (req, res, next) => {
    const {
      groupId,
      description,
      amount,
      category,
      status,
      receipt,
      splitMembers,
    } = req.body;
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
      const group = await TravelGroup.findById(groupId).populate("members");
      if (!group) {
        return next(new ErrorHandler("Group not found", 404));
      }

      // Validate splitAmong users
      let usersToSplit =
        splitMembers && splitMembers.length > 0
          ? splitMembers
          : group.members
              .map((member) => member.user.toString())
              .filter((id) => id !== paidBy.toString());

      if (usersToSplit.length === 0) {
        return next(
          new ErrorHandler(
            "At least one person must be selected to split the expense",
            400
          )
        );
      }

      // Check if all selected users are in the group
      const groupMemberIds = group.members.map((member) =>
        member.user.toString()
      );
      const invalidUsers = usersToSplit.filter(
        (userId) => !groupMemberIds.includes(userId)
      );

      if (invalidUsers.length > 0) {
        return next(
          new ErrorHandler(
            "One or more selected users are not in the group",
            400
          )
        );
      }

      // Calculate equal split share
      const shareAmount = (amount / (usersToSplit.length + 1)).toFixed(2);

      const splitDetails = usersToSplit.map((userId) => ({
        user: new mongoose.Types.ObjectId(userId), // ✅ Correct ObjectId conversion
        share: Number(shareAmount), // Ensure 'share' is a number
      }));

      // Upload receipt to Cloudinary if provided
      let uploadedImage = { public_id: "", url: "" };
      if (receipt && receipt.length > 0) {
        const result = await cloudinary.v2.uploader.upload(receipt[0], {
          folder: "receipts",
          resource_type: "auto",
        });
        uploadedImage = { public_id: result.public_id, url: result.secure_url };
      }

      // Create the expense
      const expense = await Expense.create({
        group: groupId,
        description,
        amount,
        category,
        paidBy,
        status,
        receipt: uploadedImage,
        splitBetween: splitDetails,
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
        .populate("paidBy", "name email")
        .populate({
          path: "splitBetween.user",
          select: "name email",
        })
        .exec();

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
        .populate("paidBy", "name avatar")
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

  static expenseSummary = asyncHandler(async (req, res, next) => {
    try {
      const userId = req.user._id;
      const groupId = req.params.id;

      // Validate input
      if (!mongoose.Types.ObjectId.isValid(groupId)) {
        return next(new ErrorHandler("Invalid group ID format", 400));
      }

      // Validate group exists and user is a member
      const group = await TravelGroup.findOne({
        _id: groupId,
        "members.user": userId,
      });

      if (!group) {
        return next(
          new ErrorHandler("Group not found or you're not a member", 404)
        );
      }

      // Find all unsettled expenses for the group
      const expenses = await Expense.find({
        group: groupId,
        status: { $ne: "settled" },
      })
        .populate("paidBy", "name email")
        .populate("splitBetween.user", "name email");

      // Calculate amounts
      let totalOwed = 0; // What the user owes others
      let totalToReceive = 0; // What others owe the user
      const debts = []; // Detailed debts the user owes
      const receivables = []; // Detailed amounts owed to the user

      expenses.forEach((expense) => {
        // Check if user is the payer
        if (expense.paidBy._id.equals(userId)) {
          // Calculate total owed to the user (sum of all shares except user's own)
          const othersShare = expense.splitBetween
            .filter((split) => !split.user._id.equals(userId))
            .reduce((sum, split) => sum + split.share, 0);

          if (othersShare > 0) {
            totalToReceive += othersShare;
            receivables.push({
              expenseId: expense._id,
              description: expense.description,
              totalAmount: expense.amount,
              owedToYou: othersShare,
              date: expense.createdAt,
              category: expense.category,
              debtors: expense.splitBetween
                .filter((split) => !split.user._id.equals(userId))
                .map((split) => ({
                  user: split.user,
                  amount: split.share,
                })),
            });
          }
        }
        // Check if user is in splitBetween (owes money)
        else {
          const userSplit = expense.splitBetween.find((split) =>
            split.user._id.equals(userId)
          );

          if (userSplit) {
            totalOwed += userSplit.share;
            debts.push({
              expenseId: expense._id,
              description: expense.description,
              amount: expense.amount,
              yourShare: userSplit.share,
              owedTo: expense.paidBy,
              date: expense.createdAt,
              category: expense.category,
            });
          }
        }
      });

      const netBalance = totalToReceive - totalOwed;

      res.status(200).json({
        success: true,
        data: {
          debts, // Expenses where user owes money
          receivables, // Expenses where others owe user
          totals: {
            totalOwed,
            totalToReceive,
            netBalance,
          },
        },
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

  static requestSettlement = asyncHandler(async (req, res, next) => {
    try {
      // Validate expense exists and user is the payer
      const userId = req.user._id;
      const user = await User.findById(userId);
      const expenseId = req.params.id;
      const expense = await Expense.findById(expenseId)
        .populate("paidBy", "name email")
        .populate("splitBetween.user", "name email")
        .populate("group", "name currency");

      if (!expense) {
        return next(new ErrorHandler("Expense not found", 404));
      }

      // Check if the requesting user is the one who paid

      if (!expense.paidBy._id.equals(userId)) {
        return next(
          new ErrorHandler("Only the payer can request settlement", 403)
        );
      }

      const debtors = expense.splitBetween.filter(
        (split) =>
          !split.user._id.equals(userId) && // Not the current user
          split.share > 0 && // Has outstanding balance
          split.status !== "paid" // Not already marked as paid
      );

      if (debtors.length === 0) {
        return next(
          new ErrorHandler("No users owe money for this expense", 400)
        );
      }

      // Now send the email to all the debtors
      // getting the current directory
      const __filename = fileURLToPath(import.meta.url);
      const currentDirectory = path.dirname(__filename);

      const mailPath = path.join(
        currentDirectory,
        "../mails/requestSettlement.ejs"
      );
      const emailPromises = debtors.map(async (debtor) => {
        const data = {
          debtorName: debtor.user.name,
          payerName: user.name,
          amount: debtor.share,
          expenseDescription: expense.description,
          groupName: expense.group.name,
          currency: expense.group.currency,
          expenseId: expense._id,
        };
        await ejs.renderFile(mailPath, data);
        console.log(debtor.user.email);
        await sendMail({
          email: debtor.user.email,
          subject: "Settlement Request",
          template: "requestSettlement.ejs",
          data,
        });
      });
      await Promise.all(emailPromises);
      res.status(200).json({
        messsage: "Sent",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

  static settleExpense = asyncHandler(async (req, res, next) => {
    const expenseId = req.params.id;
    const userId = req.user._id;
    const { note } = req.body;

    // Find the expense with group and user details populated
    const expense = await Expense.findById(expenseId)
      .populate("paidBy", "name")
      .populate("splitBetween.user", "name");

    if (!expense) {
      return next(new ErrorResponse("Expense not found", 404));
    }

    // Check if user is in splitBetween
    const userSplit = expense.splitBetween.find((split) =>
      split.user.equals(userId)
    );

    if (!userSplit) {
      return next(
        new ErrorResponse("User not part of this expense split", 400)
      );
    }

    // Store original status for comparison
    const originalStatus = userSplit.status;

    // Update user's share and status
    userSplit.share = 0;
    userSplit.status = "paid";

    // If user was disputing, add resolution note
    if (originalStatus === "dispute") {
      expense.notes.push(
        `${req.user.name}: Resolved their dispute and marked as paid. Note: ${
          note || "No resolution notes provided"
        }`
      );
    } else {
      expense.notes.push(`${req.user.name}: ${note || "No notes provided"}`);
    }

    // Calculate expense status based on all splits
    const paidCount = expense.splitBetween.filter(
      (split) => split.status === "paid" || split.share === 0
    ).length;

    const disputeCount = expense.splitBetween.filter(
      (split) => split.status === "dispute"
    ).length;

    const allPaid = paidCount === expense.splitBetween.length;
    const anyDispute = disputeCount > 0;

    // Determine new expense status
    if (allPaid) {
      expense.status = "settled";
    } else if (anyDispute) {
      expense.status = "disputed";
    } else {
      expense.status = "pending";
    }

    await expense.save();

    // Create settlement record
    /*
    await Settlement.create({
        expense: expenseId,
        settledBy: userId,
        settledWith: expense.paidBy,
        amount: userSplit.share, // Original share before setting to 0
        settledAt: new Date(),
        resolutionNote: originalStatus === 'dispute' ? note : undefined
    });
    */

    res.status(200).json({
      success: true,
      data: expense,
      message: allPaid
        ? "Expense fully settled"
        : originalStatus === "dispute"
        ? "Dispute resolved and marked as paid"
        : "Your share has been marked as paid",
    });
  });

  static disputeExpense = asyncHandler(async (req, res, next) => {
    try {
      const expenseId = req.params.id;
      const userId = req.user._id;
      const { note } = req.body;
      // Find the expense
      const expense = await Expense.findById(expenseId);
      if (!expense) {
        return next(new ErrorResponse("Expense not found", 404));
      }

      // Check if user is in splitBetween
      const userSplit = expense.splitBetween.find((split) =>
        split.user.equals(userId)
      );

      if (!userSplit) {
        return next(
          new ErrorResponse("User not part of this expense split", 400)
        );
      }
      userSplit.status = "dispute";
      expense.status = "disputed";
      // Save the updated expense
      expense.notes.push(`${req.user.name}: ${note ?? "No notes provided"}`);
      await expense.save();

      // TODO: SEND NOTIFICATIONS FOR THE USERS REGARDING THIS disputationg
      res.status(200).json({
        success: true,
        message: "Expense has been disputed",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });
}

export default ExpenseController;
