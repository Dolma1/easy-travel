import Journal from "../models/journalModel.js";
import { v4 as uuidv4 } from "uuid";
import cloudinary from 'cloudinary'
export const createJournal = async (req, res, next) => {
  try {
    const {title, body} = req.body
    const slug = uuidv4()
    const user = req.user._id
    
    let photo = `https://images.unsplash.com/photo-1707343848552-893e05dba6ac?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`
  
    const createdJournal = await Journal.create({
      title,
      body,
      photo,
      slug,
      user
    })



    
    return res.json(createdJournal);
  } catch (error) {
    next(error);
  }
};


export const getJournal = async(req,res,next) =>{
  try {
    const userId = req.user._id;

    // Fetch all journals where the user matches the logged-in user
    const journals = await Journal.find({ user: userId });

    // Return the fetched journals
    return res.status(200).json(journals);
  } catch (error) {
    next(error)
  }
}

// export const updatePost = async (req, res, next) => {
//   try {
//     const post = await Post.findOne({ slug: req.params.slug });

//     if (!post) {
//       const error = new Error("Post aws not found");
//       next(error);
//       return;
//     }

//     const upload = uploadPicture.single("postPicture");

//     const handleUpdatePostData = async (data) => {
//       const { title, caption, slug, body, tags, categories } = JSON.parse(data);
//       post.title = title || post.title;
//       post.caption = caption || post.caption;
//       post.slug = slug || post.slug;
//       post.body = body || post.body;
//       post.tags = tags || post.tags;
//       post.categories = categories || post.categories;
//       const updatedPost = await post.save();
//       return res.json(updatedPost);
//     };

//     upload(req, res, async function (err) {
//       if (err) {
//         const error = new Error(
//           "An unknown error occured when uploading " + err.message
//         );
//         next(error);
//       } else {
//         // every thing went well
//         if (req.file) {
//           let filename;
//           filename = post.photo;
//           if (filename) {
//             fileRemover(filename);
//           }
//           post.photo = req.file.filename;
//           handleUpdatePostData(req.body.document);
//         } else {
//           let filename;
//           filename = post.photo;
//           post.photo = "";
//           fileRemover(filename);
//           handleUpdatePostData(req.body.document);
//         }
//       }
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export const deletePost = async (req, res, next) => {
//   try {
//     const post = await Post.findOneAndDelete({ slug: req.params.slug });

//     if (!post) {
//       const error = new Error("Post was not found");
//       return next(error);
//     }

//     fileRemover(post.photo);

//     await Comment.deleteMany({ post: post._id });

//     return res.json({
//       message: "Post is successfully deleted",
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export const getPost = async (req, res, next) => {
//   try {
//     const post = await Post.findOne({ slug: req.params.slug }).populate([
//       {
//         path: "user",
//         select: ["avatar", "name"],
//       },
//       {
//         path: "categories",
//         select: ["title"],
//       },
//       {
//         path: "comments",
//         match: {
//           check: true,
//           parent: null,
//         },
//         populate: [
//           {
//             path: "user",
//             select: ["avatar", "name"],
//           },
//           {
//             path: "replies",
//             match: {
//               check: true,
//             },
//             populate: [
//               {
//                 path: "user",
//                 select: ["avatar", "name"],
//               },
//             ],
//           },
//         ],
//       },
//     ]);

//     if (!post) {
//       const error = new Error("Post was not found");
//       return next(error);
//     }

//     return res.json(post);
//   } catch (error) {
//     next(error);
//   }
// };

// export const getAllPosts = async (req, res, next) => {
//   try {
//     const filter = req.query.searchKeyword;
//     const categories = req.query.categories
//       ? req.query.categories.split(",")
//       : []; // Expecting categories to be comma-seperated

//     let where = {};

//     if (filter) {
//       where.title = { $regex: filter, $options: "i" };
//     }

//     if (categories.length > 0) {
//       where.categories = { $in: categories };
//     }

//     let query = Post.find(where);
//     const page = parseInt(req.query.page) || 1;
//     const pageSize = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * pageSize;
//     const total = await Post.find(where).countDocuments();
//     const pages = Math.ceil(total / pageSize);

//     res.header({
//       "x-filter": filter,
//       "x-totalcount": JSON.stringify(total),
//       "x-currentpage": JSON.stringify(page),
//       "x-pagesize": JSON.stringify(pageSize),
//       "x-totalpagecount": JSON.stringify(pages),
//     });

//     if (page > pages) {
//       return res.json([]);
//     }

//     const result = await query
//       .skip(skip)
//       .limit(pageSize)
//       .populate([
//         {
//           path: "user",
//           select: ["avatar", "name", "verified"],
//         },
//         {
//           path: "categories",
//           select: ["title"],
//         },
//       ])
//       .sort({ updatedAt: "desc" });

//     return res.json(result);
//   } catch (error) {
//     next(error);
//   }
// };

