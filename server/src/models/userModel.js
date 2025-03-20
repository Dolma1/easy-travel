import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { create } from "domain";
dotenv.config();

const emailRegexPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },

    email: {
      type: String,
      required: [true, "Please enter your email"],
      validate: {
        validator: function (value) {
          return emailRegexPattern.test(value);
        },
        message: "Please enter a valid email",
      },
      unique: true,
    },

    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    address: {
      type: String,
    },
 
    phone: {
      type: String,
    },

    journalStats:{
      type:Number
    },

    groupStats: {
      totalGroups: {
        type: Number,
        default: 0,
      },
      createdGroups: {
        type: Number,
        default: 0,
      },
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    bio: {
      type: String,
      maxlength: 100,
    },
    avatar: {
      public_id: String,
      url: String,
    },
  },
  { timestamps: true }
);

// Pre hooks->Check the password if modified then hash the password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password for the login
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password); // Returns true or false
};

const User = mongoose.model("User", userSchema);

export default User;
