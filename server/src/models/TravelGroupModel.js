import mongoose from "mongoose";

const travelGroupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Group name is required"],
      trim: true,
      maxLength: [50, "Group name cannot exceed 50 characters"],
    },

    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        role: {
          type: String,
          enum: ["admin", "member"],
          default: "member",
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    trip: {
      startDate: Date,
      endDate: Date,
      destination: String,
      status: {
        type: String,
        enum: ["planning", "ongoing", "completed", "cancelled"],
        default: "planning",
      },
    },
    currency: {
      type: String,
      default: "NPR",
    },

    budget: {
      type: Number,
      default: 0,
    },
    totalExpenses: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    joinCode: {
      type: String,
      default: null, // Initially null
    },
    joinCodeExpiresAt: {
      type: Date,
      default: null, // Initially null
    },
  },
  {
    timestamps: true,
  }
);

travelGroupSchema.statics.updateExpiredGroups = async function () {
  const now = new Date();

  // Find and update all groups where endDate has passed but isActive is still true
  const result = await this.updateMany(
    {
      "trip.endDate": { $lte: now },
      isActive: true, // Only update if still marked active
    },
    {
      $set: {
        isActive: false,
        "trip.status": "completed",
      },
    }
  );

  return result;
};

const TravelGroup = mongoose.model("TravelGroup", travelGroupSchema);

export default TravelGroup;
