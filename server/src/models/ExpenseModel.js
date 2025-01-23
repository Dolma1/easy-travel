import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TravelGroup",
      required: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxLength: [100, "Description cannot exceed 100 characters"],
    },
    amount: {
      value: {
        type: Number,
        required: [true, "Amount is required"],
        min: [0, "Amount cannot be negative"],
      },
      currency: {
        type: String,
        required: true,
      },
    },
    category: {
      type: String,
      enum: [
        "accommodation",
        "transport",
        "food",
        "activities",
        "shopping",
        "other",
      ],
      required: true,
    },
    paidBy: {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      paymentMethod: {
        type: String,
        enum: ["cash", "card", "upi", "other"],
      },
    },
    splitBetween: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        share: {
          type: Number,
          required: true,
        },
      },
    ],
    date: {
      type: Date,
      default: Date.now,
    },
    receipt: {
      url: String,
      uploadedAt: Date,
    },
    status: {
      type: String,
      enum: ["pending", "settled", "disputed"],
      default: "pending",
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);
