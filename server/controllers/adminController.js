const { userModel } = require("../models/userModel.js");
const postModel = require("../models/postsModel.js");
const commentModel = require("../models/commentModel.js");
const cloudinary = require("cloudinary").v2;
const { sendSuccess, sendError } = require("../utils/responseHandler.js");

// Block user
exports.blockUser = async (req, res) => {
  try {
    const { id: userId } = req.params;

    const user = await userModel.findById(userId);
    if (!user) {
      return sendError(res, 404, "User not found", "USER_NOT_FOUND");
    }

    user.isBlocked = true;
    await user.save();

    sendSuccess(
      res,
      200,
      "User blocked successfully",
      {
        id: user._id,
        name: user.name,
        email: user.email,
        isBlocked: user.isBlocked,
      }
    );
  } catch (error) {
    console.log(error);
    sendError(res, 500, "Something went wrong, please try again later", "SERVER_ERROR");
  }
};

// Unblock user
exports.unblockUser = async (req, res) => {
  try {
    const { id: userId } = req.params;

    const user = await userModel.findById(userId);
    if (!user) {
      return sendError(res, 404, "User not found", "USER_NOT_FOUND");
    }

    user.isBlocked = false;
    await user.save();

    sendSuccess(
      res,
      200,
      "User unblocked successfully",
      {
        id: user._id,
        name: user.name,
        email: user.email,
        isBlocked: user.isBlocked,
      }
    );
  } catch (error) {
    console.log(error);
    sendError(res, 500, "Something went wrong, please try again later", "SERVER_ERROR");
  }
};

// Delete post (Admin)
exports.deletePost = async (req, res) => {
  try {
    const { id: postId } = req.params;

    const post = await postModel.findById(postId);
    if (!post) {
      return sendError(res, 404, "Post not found", "POST_NOT_FOUND");
    }

    // Delete image from Cloudinary if exists
    if (post.file && post.file.name) {
      try {
        await cloudinary.uploader.destroy(post.file.name);
      } catch (err) {
        console.log("Error deleting image from Cloudinary:", err);
      }
    }

    // Delete all comments associated with this post
    await commentModel.deleteMany({ post: postId });

    // Delete the post
    await postModel.findByIdAndDelete(postId);

    sendSuccess(res, 200, "Post deleted successfully");
  } catch (error) {
    console.log(error);
    sendError(res, 500, "Something went wrong, please try again later", "SERVER_ERROR");
  }
};

// Delete comment (Admin)
exports.deleteComment = async (req, res) => {
  try {
    const { id: commentId } = req.params;

    const comment = await commentModel.findById(commentId);
    if (!comment) {
      return sendError(res, 404, "Comment not found", "COMMENT_NOT_FOUND");
    }

    await commentModel.findByIdAndDelete(commentId);

    sendSuccess(res, 200, "Comment deleted successfully");
  } catch (error) {
    console.log(error);
    sendError(res, 500, "Something went wrong, please try again later", "SERVER_ERROR");
  }
};

// Get all posts (Admin)
exports.getAllPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const posts = await postModel
      .find()
      .populate("user", "name email profile_pic")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip(skip);

    const totalPosts = await postModel.countDocuments();

    sendSuccess(
      res,
      200,
      "Posts fetched successfully",
      {
        posts: posts.map((post) => ({
          id: post._id,
          content: post.content,
          file: post.file,
          user: {
            id: post.user._id,
            name: post.user.name,
            email: post.user.email,
          },
          likesCount: post.likes.length,
          createdAt: post.createdAt,
        })),
      },
      {
        page: parseInt(page),
        limit: parseInt(limit),
        totalRecords: totalPosts,
        totalPages: Math.ceil(totalPosts / limit),
      }
    );
  } catch (error) {
    console.log(error);
    sendError(res, 500, "Something went wrong, please try again later", "SERVER_ERROR");
  }
};

// Get basic analytics
exports.getAnalytics = async (req, res) => {
  try {
    const totalUsers = await userModel.countDocuments();
    const totalPosts = await postModel.countDocuments();
    const totalComments = await commentModel.countDocuments();
    const blockedUsers = await userModel.countDocuments({ isBlocked: true });

    sendSuccess(
      res,
      200,
      "Analytics fetched successfully",
      {
        analytics: {
          totalUsers,
          totalPosts,
          totalComments,
          blockedUsers,
          activeUsers: totalUsers - blockedUsers,
        },
      }
    );
  } catch (error) {
    console.log(error);
    sendError(res, 500, "Something went wrong, please try again later", "SERVER_ERROR");
  }
};
