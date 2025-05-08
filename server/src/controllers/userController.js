import ejs from "ejs";
import jwt from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import User from "../models/UserModel.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import sendMail from "../utils/sendMail.js";
import createActivationToken from "../utils/activation.js";
import { sendToken } from "../utils/jwt.js";
import cloudinary from "cloudinary";
import TravelGroup from "../models/TravelGroupModel.js";
import Expense from "../models/ExpenseModel.js";
import Settlement from "../models/SettlementModel.js";
import Journal from "../models/journalModel.js";
import mongoose from "mongoose";

class UserController {
  /********** AUTHENTICATION CONTROLLERS **********/
  static registerUser = asyncHandler(async (req, res, next) => {
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
      const isEmailExist = await User.findOne({ email });

      if (isEmailExist) {
        return next(new ErrorHandler("Email already exists", 400));
      }
      // putting the destructured object variable in one object known as user
      const user = {
        name,
        email,
        password,
      };

      const activationToken = createActivationToken(user);
      const activationCode = activationToken.activationCode;

      const data = { user: { name: user.name }, activationCode };
      // getting the current directory
      const __filename = fileURLToPath(import.meta.url);
      const currentDirectory = path.dirname(__filename);

      const mailPath = path.join(
        currentDirectory,
        "../mails/activationMail.ejs"
      );

      // console.log('This is the mailPath', mailPath);
      const html = await ejs.renderFile(mailPath, data);

      // Send mail function call
      try {
        await sendMail({
          email: user.email,
          subject: "Activate your account",
          template: "activationMail.ejs",
          data,
        });
        res.status(201).json({
          success: true,
          message: `Please check your email: ${user.email} to activate your account.`,
          activationToken: activationToken.token,
        });
      } catch (error) {
        return next(new ErrorHandler(error.message, 500));
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

  static activateUser = asyncHandler(async (req, res, next) => {
    try {
      const { activation_code, activation_token } = req.body;

      const newUser = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET
      );

      // console.log(newUser);
      // console.log(newUser.activationCode);
      if (newUser.activationCode !== activation_code) {
        return next(new ErrorHandler("Invalid activation Code", 400));
      }

      const { name, email, password } = newUser?.userdata;

      const existUser = await User.findOne({ email });

      if (existUser) {
        return next(new ErrorHandler("Email already exits", 400));
      }

      await User.create({
        name,
        email,
        password,
        isVerified: true,
      });

      res.status(201).json({
        success: true,
        message: "User has been successfully created",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

  static loginUser = asyncHandler(async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return next(
          new ErrorHandler("Please enter your email or Password", 400)
        );
      }
      const user = await User.findOne({ email }).select("+password");


      if (!user) {
        return next(new ErrorHandler("Invalid Email or Password", 400));
      }

      const isPasswordMatch = await user.comparePassword(password);

      if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid Email or Password", 400));
      }
      if(user.isBanned){
        return next(new ErrorHandler("You have been banned..", 400))
      }
      if(!user.isVerified){
        return next(new ErrorHandler("You are not verified yet.", 400))
      }
      sendToken(user._id, res);

      delete user._doc.password;

      // response to the frontend
      return res.status(201).json({
        success: true,
        message: "User is successfully logged in",
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

  static logoutUser = asyncHandler(async (req, res, next) => {
    try {
      res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0),
      });
      res.status(200).json({
        success: true,
        message: "User logged out successfully",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

  /*********** PROFILE MANAGEMENT CONTROLLERS *****************/
  static getUserProfile = asyncHandler(async (req, res, next) => {
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      return res.status(200).json({
        success: true,
        message: "User profile fetched",
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

  static updateUserDetails = asyncHandler(async (req, res, next) => {
    try {
      const { name, address, avatar, bio, phone } = req.body;
      const userId = req.user;
      const user = await User.findById(userId);
      // handle avatar change functionality
      // Upload the image to Cloudinary
      const result = await cloudinary.v2.uploader.upload(avatar, {
        folder: "avatars", // Optional: Save images in a specific folder
        resource_type: "auto", // Automatically detect the file type
      });
      const uploadedImage = {
        public_id: result.public_id,
        url: result.secure_url,
      };

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          name: name || user.name,
          address: address || user.address,
          phone: phone || user.phone,
          avatar: uploadedImage || user.avatar,
          bio: bio || user.bio,
        },
        { new: true }
      );
      return res
        .status(201)
        .json({ success: true, message: "Profile Updated Successfully" });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

  static deleteUserDetails = asyncHandler(async (req, res, next) => {});

  static changePassword = asyncHandler(async (req, res, next) => {
    try {
      const { oldPassword, newPassword } = req.body;
      const user = User.findById(req.user._id).select("+password");
      if (!oldPassword && !newPassword) {
        return next(new ErrorHandler("Please enter old and new password"), 400);
      }

      const isPasswordMatch = await user?.comparePassword(oldPassword);
      if (!isPasswordMatch) {
        return next(new ErrorHandler("Password is incorrect", 400));
      }
      user.password = newPassword;
      await user.save();

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

  /********* OTHER CONTROLLERS FOR USER ***********/
  static getDashboardData = async (req, res, next) => {
    try {
      const userId = req.user._id;
      const today = new Date();

      // 1. Fetch User Profile
      const user = await User.findById(userId).select(
        "name avatar bio groupStats"
      );

      // 2. Fetch Trips (Upcoming, Previous, and Active)
      const allTrips = await TravelGroup.find({ "members.user": userId })
        .select("name trip currency budget totalExpenses members creator")
        .populate("creator", "name avatar")
        .sort({ "trip.startDate": 1 });

      // Categorize trips by date
      const upcomingTrips = allTrips.filter(
        (trip) =>
          new Date(trip.trip.startDate) > today &&
          trip.trip.status !== "cancelled"
      );

      const previousTrips = allTrips.filter(
        (trip) =>
          new Date(trip.trip.endDate) < today ||
          trip.trip.status === "completed"
      );

      const activeTrips = allTrips.filter(
        (trip) =>
          new Date(trip.trip.startDate) <= today &&
          new Date(trip.trip.endDate) >= today &&
          trip.trip.status !== "cancelled"
      );

      // 3. Fetch Financial Data
      // a. Expenses user PAID directly
      const paidByUser = await Expense.aggregate([
        { $match: { paidBy: new mongoose.Types.ObjectId(userId) } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]);

      // b. Expenses user OWES a share of (unpaid splits)
      const shareOwedByUser = await Expense.aggregate([
        {
          $match: {
            "splitBetween.user": new mongoose.Types.ObjectId(userId),
            "splitBetween.status": "unpaid",
          },
        },
        { $unwind: "$splitBetween" },
        {
          $match: { "splitBetween.user": new mongoose.Types.ObjectId(userId) },
        },
        { $group: { _id: null, total: { $sum: "$splitBetween.share" } } },
      ]);

      // c. Expenses by Category
      const expensesByCategory = await Expense.aggregate([
        { $match: { paidBy: new mongoose.Types.ObjectId(userId) } },
        { $group: { _id: "$category", total: { $sum: "$amount" } } },
        { $sort: { total: -1 } },
      ]);

      // Format category data
      const categoryData = {};
      expensesByCategory.forEach((item) => {
        categoryData[item._id] = item.total;
      });

      const totalPaid = paidByUser[0]?.total || 0;
      const totalOwed = shareOwedByUser[0]?.total || 0;

      // 4. Recent Expenses (Last 5)
      const recentExpenses = await Expense.find({
        $or: [{ paidBy: userId }, { "splitBetween.user": userId }],
      })
        .sort({ date: -1 })
        .limit(5)
        .populate("group", "name")
        .populate("paidBy", "name avatar");

      // 5. Pending Settlements (Owed/Receivable)
      const pendingSettlements = await Settlement.find({
        $or: [{ payer: userId }, { receiver: userId }],
        status: { $ne: "completed" },
      })
        .populate("payer receiver", "name avatar")
        .populate("group", "name");

      // 6. Latest Journals
      const latestJournals = await Journal.find({ author: userId })
        .sort({ createdAt: -1 })
        .limit(3)
        .select("title content mood createdAt location");

      // 7. Journal stats
      const journalCount = await Journal.countDocuments({ author: userId });

      // 8. Compile Dashboard Response
      const dashboardData = {
        profile: {
          name: user.name,
          avatar: user.avatar,
          bio: user.bio,
          totalTrips: allTrips.length,
          journalCount: journalCount,
          groupStats: user.groupStats,
        },
        trips: {
          upcoming: upcomingTrips.map((trip) => ({
            id: trip._id,
            name: trip.name,
            destination: trip.trip.destination,
            startDate: trip.trip.startDate,
            endDate: trip.trip.endDate,
            status: trip.trip.status,
            memberCount: trip.members.length,
            creator: trip.creator,
          })),
          previous: previousTrips.map((trip) => ({
            id: trip._id,
            name: trip.name,
            destination: trip.trip.destination,
            startDate: trip.trip.startDate,
            endDate: trip.trip.endDate,
            status: trip.trip.status,
            memberCount: trip.members.length,
            creator: trip.creator,
          })),
          active: activeTrips.map((trip) => ({
            id: trip._id,
            name: trip.name,
            destination: trip.trip.destination,
            startDate: trip.trip.startDate,
            endDate: trip.trip.endDate,
            status: trip.trip.status,
            memberCount: trip.members.length,
            creator: trip.creator,
          })),
        },
        finances: {
          summary: {
            totalPaid,
            totalOwed,
            netBalance: totalPaid - totalOwed,
          },
          categoryBreakdown: categoryData,
          recentExpenses: recentExpenses.map((expense) => ({
            id: expense._id,
            description: expense.description,
            amount: expense.amount,
            category: expense.category,
            date: expense.date,
            paidBy: expense.paidBy,
            group: expense.group,
            currency: expense.currency,
          })),
          pendingSettlements: pendingSettlements.map((settlement) => ({
            id: settlement._id,
            amount: settlement.amount,
            status: settlement.status,
            payer: settlement.payer,
            receiver: settlement.receiver,
            group: settlement.group,
          })),
        },
        activity: {
          latestJournals: latestJournals.map((journal) => ({
            id: journal._id,
            title: journal.title,
            content:
              journal.content?.substring(0, 100) +
              (journal.content?.length > 100 ? "..." : ""),
            mood: journal.mood,
            date: journal.createdAt,
            location: journal.location,
          })),
        },
      };

      return res.status(200).json({
        success: true,
        dashboardData,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  };

  static getSettlements = asyncHandler(async (req, res, next) => {
    try {
      const user = await User.findById(req.user._id);

      // Get settlements where the user is the payer
      const paidSettlements = await Settlement.find({ payer: user._id })
        .populate("receiver", "name email") // who received the payment
        .populate("group", "name")
        .populate("expense", "description amount");

      // Get settlements where the user is the receiver
      const receivedSettlements = await Settlement.find({ receiver: user._id })
        .populate("payer", "name email") // who paid the user
        .populate("group", "name")
        .populate("expense", "description amount");

      res.status(200).json({
        success: true,
        paidSettlements, // user paid others
        receivedSettlements, // user received from others
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });
}
export default UserController;
