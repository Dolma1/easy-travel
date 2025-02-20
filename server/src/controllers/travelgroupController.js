import TravelGroup from "../models/TravelGroupModel.js";
import User from "../models/UserModel.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import Expense from "../models/ExpenseModel.js";

class TravelGroupController {
  /** GROUPS CREATION AND DELETION FUNCTIONALITY */
  static createGroup = asyncHandler(async (req, res, next) => {
    const { name, startDate, endDate, destination, budget, currency } =
      req.body;
    const creatorId = req.user._id;
    try {
      if (!name || !creatorId) {
        return next(
          new ErrorHandler("Group name and creator Id is required", 400)
        );
      }
      // Check if the creator exists
      const creator = await User.findById(creatorId);
      if (!creator) {
        return res.status(404).json({ message: "User not found" });
      }
      // Creating the GROUP
      const newGroup = new TravelGroup({
        name,
        currency,

        creator: creatorId,
        members: [
          {
            user: creatorId,
            role: "admin", // Set the creator as the admin
            joinedAt: Date.now(),
            balance: 0, // Initial balance is 0
          },
        ],
        trip: {
          startDate,
          endDate,
          destination,
          status: "planning", // Default status
        },
        budget: Number(budget) || 0,
        totalExpenses: 0, // Initial total expenses
        isActive: true, // Group is active by default
      });
      await newGroup.save();
      // Send the Created Message:
      res.status(201).json({
        success: true,
        message: "Group Created Successfully",
        group: newGroup,
      });
      // LOGIC TO create a new GROUP
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });
  static deleteGroup = asyncHandler(async (req, res, next) => {});

  /* TOGGLE MEMBERS FUNCTIONALITY */
  static addOrRemoveMembers = asyncHandler(async (req, res, next) => {
    try {
      const { userIds } = req.body;
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

  /********* GET GROUPS- MANY AND SINGLE *************/
  static fetchGroups = asyncHandler(async (req, res, next) => {
    // get the user
    const userId = req.user._id;
    if (!userId) {
      return next(new ErrorHandler("User not found", 400));
    }
    try {
      // Find the groups if the user is member or user is creator using
      const groups = await TravelGroup.find({
        $or: [{ creator: userId }, { "members.user": userId }],
      })
        .populate("creator", "name email")
        .populate("members.user", "name email");
      // TODO: MOdify the Groups --> Not found groups === 404 error
      if (!groups || groups.length === 0) {
        return next(new ErrorHandler("No groups found", 404));
      }
      // Return the groups
      res.status(200).json({
        success: true,
        count: groups.length,
        data: groups,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
    // Logic to fetch the groups if your are  part or you have created.
  });

  static fetchSingleGroup = asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    const userId = req.user._id;
    try {
      // Find the group by ID
      const group = await TravelGroup.findById(id)
        .populate("creator", "name email") // Populate creator details
        .populate("members.user", "name email"); // Populate member details

      // If the group doesn't exist, return a 404 error
      if (!group) {
        return next(new ErrorHandler("Group not found", 404));
      }
      

      // Check if the user is the creator or a member of the group
      const isCreator = group.creator._id.toString() === userId.toString();

      const isMember = group.members.some(
        (member) => member.user._id.toString() === userId.toString()
      );

      // If the user is neither the creator nor a member, return a 403 error
      if (!isCreator && !isMember) {
        return next(
          new ErrorHandler("You are not authorized to access this group", 403)
        );
      }

      return res.status(200).json({
        success: true,
        group,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

  static fetchGroupExpenses = asyncHandler(async (req, res, next) => {
    const groupid = req.params.id;

    try {
      // Find the group
      const group = await TravelGroup.findById(groupid);
      if (!group) {
        return next(new ErrorHandler("Group not found", 404));
      }

      // Fetch all expenses for the group
      const expenses = await Expense.find({ group: groupid })
        .populate("paidBy", "name email")
        .populate("splitBetween.user", "name email");

      res.status(200).json({
        success: true,
        count: expenses.length,
        expenses,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });
}

export default TravelGroupController;
