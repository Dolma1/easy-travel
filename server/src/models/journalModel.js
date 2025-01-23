import mongoose from "mongoose";

const journalSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxLength: [100, "Title cannot be more than 100 characters"],
    },

    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
      maxLength: [1000, "Content cannot be more than 1000 characters"],
    },

    mood: {
      type: String,
      enum: [
        "happy",
        "sad",
        "anxious",
        "excited",
        "neutral",
        "angry",
        "grateful",
      ],
      default: "neutral",
    },

    location: {
      type: String,
    },

    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    images: [
      {
        public_id: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isPrivate: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Journal = mongoose.model("Journal", journalSchema);

export default Journal;
