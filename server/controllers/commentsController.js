const commentModel = require("../models/commentModel.js");
const postModel = require("../models/postsModel.js");
const { sendSuccess, sendError } = require("../utils/responseHandler.js");

// Add comment
exports.addComment = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const { text } = req.body;

    // Check if post exists
    const post = await postModel.findById(postId);
    if (!post) {
      return sendError(res, 404, "Post not found", "POST_NOT_FOUND");
    }

    // Create comment
    const comment = await commentModel.create({
      post: postId,
      user: req.user._id,
      text: text,
    });

    // Populate user details
    await comment.populate("user", "name profile_pic");

    sendSuccess(
      res,
      201,
      "Comment added successfully",
      {
        comment: {
          id: comment._id,
          text: comment.text,
          user: {
            id: comment.user._id,
            name: comment.user.name,
            profile_pic: comment.user.profile_pic,
          },
          createdAt: comment.createdAt,
        },
      }
    );
  } catch (error) {
    console.log(error);
    sendError(res, 500, "Something went wrong, please try again later", "SERVER_ERROR");
  }
};

// Get all comments for a post
exports.getComments = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Check if post exists
    const post = await postModel.findById(postId);
    if (!post) {
      return sendError(res, 404, "Post not found", "POST_NOT_FOUND");
    }

    const skip = (page - 1) * limit;

    // Get comments with pagination
    const comments = await commentModel
      .find({ post: postId })
      .populate("user", "name profile_pic")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip(skip);

    const totalComments = await commentModel.countDocuments({ post: postId });

    sendSuccess(
      res,
      200,
      "Comments fetched successfully",
      {
        comments: comments.map((comment) => ({
          id: comment._id,
          text: comment.text,
          user: {
            id: comment.user._id,
            name: comment.user.name,
            profile_pic: comment.user.profile_pic,
          },
          createdAt: comment.createdAt,
        })),
      },
      {
        page: parseInt(page),
        limit: parseInt(limit),
        totalRecords: totalComments,
        totalPages: Math.ceil(totalComments / limit),
      }
    );
  } catch (error) {
    console.log(error);
    sendError(res, 500, "Something went wrong, please try again later", "SERVER_ERROR");
  }
};

// Delete comment
exports.deleteComment = async (req, res) => {
  try {
    const { id: commentId } = req.params;

    // Find comment
    const comment = await commentModel.findById(commentId);
    if (!comment) {
      return sendError(res, 404, "Comment not found", "COMMENT_NOT_FOUND");
    }

    // Check authorization (only comment owner or admin can delete)
    if (
      comment.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return sendError(res, 403, "You are not authorized to delete this comment", "UNAUTHORIZED_DELETE");
    }

    // Delete comment
    await commentModel.findByIdAndDelete(commentId);

    sendSuccess(res, 200, "Comment deleted successfully");
  } catch (error) {
    console.log(error);
    sendError(res, 500, "Something went wrong, please try again later", "SERVER_ERROR");
  }
};
