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
}

export default UserController;
