import User from "../models/UserModel.js";
import cloudinary from "cloudinary";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import Journal from "../models/journalModel.js";
import TravelGroup from "../models/TravelGroupModel.js";
import cron from "node-cron";
class JournalController {
  static createJournal = asyncHandler(async (req, res, next) => {
    try {
      const {
        title,
        content,
        mood,
        location,
        tags,
        budget,
        isPrivate = true,
      } = req.body;

      if (!title && !content && !tags && !req.body.images) {
        let errors = {
          title: "Title is required",
          content: "Content is required",
          tags: "At least one Tag is required",
          images: "At least one image is required",
          budget: "Budject is required",
        };
        return next(new ErrorHandler("Journal Creation Failed!", 404, errors));
      }

      // Handle Image section using cloudinary
      let images = [];

      // If images are passed as a string (for a single image)
      if (typeof req.body.images === "string") {
        images.push(req.body.images);
      } else {
        images = req.body.images;
      }

      // Now uploading the images to Cloudinary
      const imagesLinks = [];
      for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
          folder: "posts",
          quality: "auto:best",
          height: 600,
        });

        // Storing the image links and public_id
        imagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }

      // Increment the user Journal Entry
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { journalEntries: 1 },
      });

      // Create a new Journal
      let journal = await Journal.create({
        author: req.user._id,
        title,
        content,
        mood,
        location,
        tags,
        isPrivate,
        budget,
        images: imagesLinks,
      });

      return res.status(201).json({ success: true, journal });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

  static getAllJournal = asyncHandler(async (req, res, next) => {
    try {
      const userId = req.user._id;
      const allJournals = await Journal.find({ author: userId }).populate(
        "author",
        "name"
      );
      if (!allJournals || allJournals.length === 0) {
        return res.status(200).json({
          success: false,
          message: "No Journals Found",
        });
      }
      return res.status(200).json({ success: true, allJournals });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

  static getExploreJournals = asyncHandler(async (req, res, next) => {
    try {
      const allJournals = await Journal.find({
        isPrivate: false,
      }).populate("author", "name");
      if (!allJournals || allJournals.length === 0) {
        return res.status(200).json({
          success: false,
          message: "No Journals Found",
        });
      }

      const userId = req.user._id;

      // 1. Find all groups where user is either creator or member
      const userGroups = await TravelGroup.find({
        $and: [
          { $or: [{ creator: userId }, { "members.user": userId }] },
          { "trip.endDate": { $gt: new Date() } },
        ],
      });

      // 2. Extract unique destinations from these groups
      const groupDestinations = [
        ...new Set(
          userGroups.map((group) => group.trip.destination).filter(Boolean)
        ),
      ];

      const query = {
        isPrivate: false,
        author: { $ne: userId },
      };

      if (groupDestinations.length > 0) {
        query.location = { $in: groupDestinations };
      } else {
        return res.status(200).json({
          success: true,
          allJournals,
          recommendedJournals: [],
          message: "Public Journals Found",
        });
      }

      const recommendedJournals = await Journal.find(query).populate(
        "author",
        "name"
      );

      if (!recommendedJournals || recommendedJournals.length === 0) {
        return res.status(200).json({
          success: true,
          allJournals,
          recommendedJournals: [],
          message: "Public Journals Found",
        });
      }

      return res.status(200).json({
        success: true,
        allJournals,
        recommendedJournals,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

  static updateJournal = asyncHandler(async (req, res, next) => {
    try {
      const id = req.params.id;
      const { title, content, mood, location, tags, isPrivate, budget } =
        req.body;

      // Handle Image section using cloudinary
      let images = [];

      // If images are passed as a string (for a single image)
      if (typeof req.body.images === "string") {
        images.push(req.body.images);
      } else {
        images = req.body.images;
      }

      // Now uploading the images to Cloudinary
      const imagesLinks = [];
      for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
          folder: "posts",
          quality: "auto:best",
          height: 600,
        });

        // Storing the image links and public_id
        imagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }

      const updatedJournal = await Journal.findByIdAndUpdate(
        id,
        {
          title,
          content,
          mood,
          location,
          tags,
          budget,
          images: imagesLinks,
          isPrivate,
          budget,
        },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!updatedJournal) {
        return next(new ErrorHandler("Journal was not found", 400));
      }

      return res.status(201).json({ success: true, journal: updatedJournal });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

  static deleteJournal = asyncHandler(async (req, res, next) => {
    try {
      const id = req.params.id;

      const author = await User.findById(req.user._id);

      if (!author) {
        return res
          .status(404)
          .json({ success: false, message: "Author not found!" });
      }

      const deletedJournal = await Journal.findByIdAndDelete(id);

      if (!deletedJournal) {
        return next(new ErrorHandler("Journal was not found", 400));
      }

      // Decrement the user Journal Entries
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { journalEntries: -1 },
      });

      return res
        .status(200)
        .json({ status: true, message: "Journal was deleted Successfully" });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

  static getSingleJournal = asyncHandler(async (req, res, next) => {
    try {
      const id = req.params.id;
      const journal = await Journal.findById(id).populate("author");

      if (!journal) {
        return next(new ErrorHandler("Journal not found", 404));
      }
      return res.status(200).json({ success: true, journal });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });
}


cron.schedule("0 0 * * *", async () => {
  try {
    const result = await TravelGroup.updateExpiredGroups();
    console.log(`Updated ${result.modifiedCount} expired groups.`);
  } catch (err) {
    console.error("Error updating expired groups:", err);
  }
});


export default JournalController;
