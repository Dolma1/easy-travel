import TravelGroup from "../models/TravelGroupModel.js";
import User from "../models/UserModel.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import Expense from "../models/ExpenseModel.js";
import crypto from "crypto";
import { group } from "console";
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
      if (!groups || groups.length === 0) {
        return res.status(200).json({
          success: false,
          message: "No Group Found",
        });
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
      // console.log(group)

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

  static getGroupInvitationCode = asyncHandler(async (req, res, next) => {
    try {
      const groupId = req.params.id;
      const userId = req.user._id;
      // Find the travel group by ID
      const group = await TravelGroup.findById(groupId);
      if (!group) {
        return next(new ErrorHandler("Group not found", 404));
      }
      // add logic such that only the creator of the group can create the code if group.
      if (group.creator.toString() !== userId.toString()) {
        return next(new ErrorHandler("You are not the group admin", 404));
      }

      // Generate a 10-character random code
      const joinCode = crypto.randomBytes(5).toString("hex").toUpperCase();

      // Set join code and expiration time (10 minutes from now)
      group.joinCode = joinCode;
      group.joinCodeExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

      // Save the updated group
      await group.save();

      res.json({
        success: true,
        message: "Join code generated successfully!",
        data: {
          code: group.joinCode,
          expires: group.joinCodeExpiresAt,
        },
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

  // Join Group Functionality
  static verifyJoinGroupCode = asyncHandler(async (req, res, next) => {
    try {
      const { joinCode } = req.body;
      // Find group with this join code
      const group = await TravelGroup.findOne({ joinCode });
      if (!group) {
        return next(new ErrorHandler("Invalid or Expired Join code", 404));
      }

      // Also check if the group.joinCodeExpire is greater than 10 minutes if yes then please throw error invalid or expire code
      // 🔹 Check if the join code has expired
      if (group.joinCodeExpiresAt && new Date() > group.joinCodeExpiresAt) {
        return next(new ErrorHandler("Invalid or Expired Join Code", 400));
      }
      // check if  the user is already a member of the group
      const isMember = group.members.some(
        (member) => member.user.toString() === req.user._id.toString()
      );
      if (isMember) {
        return res.status(200).json({
          success: true,
          isMember: true,
          message: "You are already the member of this group",
          group,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Group code verified",
        isMember: false,
        group,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

  static joinGroup = asyncHandler(async (req, res, next) => {
    console.log(req.body);
    try {
      const user = await User.findById(req.user._id);

      if (!user) {
        return next(new ErrorHandler("User not found", 400));
      }

      const { groupId } = req.body;
      const group = await TravelGroup.findById(groupId);
      const isMember = await TravelGroup.findOne({
        _id: groupId,
        "members.user": user._id,
      });
      if (isMember) {
        return next(
          new ErrorHandler("User is already a member of this group", 400)
        );
      }
      // Add the user to the group
      const updatedGroup = await TravelGroup.findByIdAndUpdate(
        groupId,
        {
          $push: {
            members: {
              user: user._id,
              role: "member",
              joinedAt: new Date(),
            },
          },
        },
        { new: true } // Return the updated document
      );

      if (!updatedGroup) {
        return next(new ErrorHandler("Group not found", 404));
      }

      res.status(200).json({
        success: true,
        message: "Group Joined Successfully",
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
