import { asyncHandler } from "../middlewares/asyncHandler.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import mongoose from "mongoose";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";
import sendMail from "../utils/sendMail.js";
import User from "../models/UserModel.js";
import Journal from "../models/journalModel.js";
import TravelGroup from "../models/TravelGroupModel.js";
import Settlement from "../models/SettlementModel.js";

class AdminController {
  static getDashboardData = asyncHandler(async (req, res, next) => {
    try {
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

  static getAllUsers = asyncHandler(async (req, res, next) => {
    try {
      const users = await User.find();
      if (!users) {
        return res
          .status(200)
          .json({ success: true, message: "No user Found" });
      }

      return res.status(200).json({
        success: true,
        message: "Users Fetched successfully",
        users,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

  static getAllJournals = asyncHandler(async (req, res, next) => {
    try {
      const journals = await Journal.find().populate({
        path: "author",
        select: "name email avatar",
      });

      if (!journals || journals.length === 0) {
        return res
          .status(200)
          .json({ success: true, message: "No journals Found" });
      }

      return res.status(200).json({
        success: true,
        message: "Journals Fetched successfully",
        journals,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

  static removeJournal = asyncHandler(async (req, res, next) => {
    try {
      const journal = await Journal.findById(req.params.id);

      if (!journal) {
        return next(new ErrorHandler("Journal not found", 404));
      }

      await Journal.findByIdAndDelete(req.params.id);

      res.status(200).json({
        success: true,
        message: "Journal deleted successfully",
        deletedJournal: journal,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

  static getAllGroups = asyncHandler(async (req, res, next) => {
    try {
      const groups = await TravelGroup.find()
        .populate({
          path: "creator",
          select: "name email", // assuming your User model has 'name' and 'email' fields
        })
        .populate({
          path: "members.user",
          select: "name email", // populate user details in members array
        }).sort({createdAt:-1});

      // Transform the groups to include member count
      const groupsWithMemberCount = groups.map((group) => ({
        ...group.toObject(),
        memberCount: group.members.length,
      }));

      if (!groups || groups.length === 0) {
        return res.status(200).json({
          success: true,
          message: "No groups found",
          groups: [],
        });
      }

      return res.status(200).json({
        success: true,
        message: "Groups fetched successfully",
        groups: groupsWithMemberCount,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

  static getAllSettlements = asyncHandler(async (req, res, next) => {
    try {
      const settlements = await Settlement.find()
        .populate({
          path: "group",
          select: "name currency", // Include only essential group info
        })
        .populate({
          path: "expense",
          select: "description amount", // Include essential expense info
        })
        .populate({
          path: "payer",
          select: "name email", // Payer's basic info
        })
        .populate({
          path: "receiver",
          select: "name email", // Receiver's basic info
        })
        .sort({ createdAt: -1 }); // Sort by newest first

      if (!settlements || settlements.length === 0) {
        return res.status(200).json({
          success: true,
          message: "No settlements found",
          settlements: [],
        });
      }

      return res.status(200).json({
        success: true,
        message: "Settlements fetched successfully",
        settlements,
        count: settlements.length, // Optional: include total count
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

  static addUserByAdmin = asyncHandler(async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      if (!name) {
        return next(new ErrorHandler("Name cannot be empty", 400));
      }

      if (!email) {
        return next(new ErrorHandler("Email cannot be empty", 400));
      }
      if (!password) {
        return next(new ErrorHandler("Password cannot be empty", 400));
      }
      const existUser = await User.findOne({ email });
      if (existUser) {
        return next(new ErrorHandler("User already exists", 400));
      }
      await User.create({ name, email, password, isVerified: true });
      res.status(201).json({
        success: true,
        messaged: "User Added Successfully",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

  static banUserByAdmin = asyncHandler(async (req, res, next) => {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId);
      if (!user) {
        return next(new ErrorHandler("User not found", 400));
      }
      if (user.isBanned) {
        user.isBanned = false;
      } else {
        user.isBanned = true;
      }

      await user.save();
      return res.status(200).json({
        success: true,
        message: user.isBanned
          ? "User unbanned successfully"
          : "User banned Successfully",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });
}
export default AdminController;
