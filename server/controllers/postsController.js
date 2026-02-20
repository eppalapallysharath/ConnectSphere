const { fileUpload } = require("../utils/fileupload.js");
const fs = require("fs");
const postModel = require("../models/postsModel.js");
const commentModel = require("../models/commentModel.js");
const cloudinary = require("cloudinary").v2;
const {sendSuccess, sendError} = require("../utils/responseHandler.js");

// Create post
exports.createPosts = async (req, res) => {
  try {
    const { content } = req.body;
    const uploadFileURL = await fileUpload(req.file.path);
    fs.unlinkSync(req.file.path);

    const create = await postModel.create({
      user: req.user._id,
      content: content,
      file: {
        name: req.file.filename,
        url: uploadFileURL,
      },
    });

    await create.populate("user", "name profile_pic");

    sendSuccess(res, 201, "Post created successfully", {
      post: {
        id: create._id,
        content: create.content,
        file: create.file,
        user: {
          id: create.user._id,
          name: create.user.name,
        },
        likesCount: 0,
        commentsCount: 0,
        createdAt: create.createdAt,
      },
    });
  } catch (error) {
    console.log(error);
    sendError(res, 500, "Something went wrong, please try again later", "SERVER_ERROR");
  }
};

// Get all posts with pagination
exports.getAllPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit; // 2-1 = 1 *10 = 0 , page 2 and limit 20 (2-1) *20 = 20 so skip first 20 record give next 20 records

    const posts = await postModel
      .find()
      .populate("user", "name email profile_pic")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip(skip);

    const totalPosts = await postModel.countDocuments();

    // Get comments count for each post
    const postsWithComments = await Promise.all(
      posts.map(async (post) => {
        const commentsCount = await commentModel.countDocuments({
          post: post._id,
        });
        return {
          id: post._id,
          content: post.content,
          file: post.file,
          user: {
            id: post.user._id,
            name: post.user.name,
            profile_pic: post.user.profile_pic,
          },
          likesCount: post.likes.length,
          commentsCount: commentsCount,
          createdAt: post.createdAt,
        };
      })
    );

    sendSuccess(res, 200, "Posts fetched successfully", {
      posts: postsWithComments,
    }, {
      page: parseInt(page),
      limit: parseInt(limit),
      totalRecords: totalPosts,
      totalPages: Math.ceil(totalPosts / limit),
    });
  } catch (error) {
    console.log(error);
    sendError(res, 500, "Something went wrong, please try again later", "SERVER_ERROR");
  }
};

// Get single post
exports.getSinglePost = async (req, res) => {
  try {
    const { id: postId } = req.params;

    const post = await postModel
      .findById(postId)
      .populate("user", "name email profile_pic");

    if (!post) {
      return sendError(res, 404, "Post not found", "POST_NOT_FOUND");
    }

    const commentsCount = await commentModel.countDocuments({ post: postId });

    sendSuccess(res, 200, "Post fetched successfully", {
      post: {
        id: post._id,
        content: post.content,
        file: post.file,
        user: {
          id: post.user._id,
          name: post.user.name,
          email: post.user.email,
          profile_pic: post.user.profile_pic,
        },
        likesCount: post.likes.length,
        commentsCount: commentsCount,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      },
    });
  } catch (error) {
    console.log(error);
    sendError(res, 500, "Something went wrong, please try again later", "SERVER_ERROR");
  }
};

// Get own posts
exports.getMyOwnPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const posts = await postModel
      .find({ user: req.user._id })
      .populate("user", "name profile_pic")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip(skip);

    const totalPosts = await postModel.countDocuments({ user: req.user._id });

    // Get comments count for each post
    const postsWithComments = await Promise.all(
      posts.map(async (post) => {
        const commentsCount = await commentModel.countDocuments({
          post: post._id,
        });
        return {
          id: post._id,
          content: post.content,
          file: post.file,
          user: {
            id: post.user._id,
            name: post.user.name,
          },
          likesCount: post.likes.length,
          commentsCount: commentsCount,
          createdAt: post.createdAt,
        };
      })
    );

    sendSuccess(res, 200, "Posts fetched successfully", {
      posts: postsWithComments,
    }, {
      page: parseInt(page),
      limit: parseInt(limit),
      totalRecords: totalPosts,
      totalPages: Math.ceil(totalPosts / limit),
    });
  } catch (error) {
    console.log(error);
    sendError(res, 500, "Something went wrong, please try again later", "SERVER_ERROR");
  }
};

// Update post
exports.updatePost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const post = await postModel.findOne({user:req.user._id, _id:postId});

    if (!post) {
      return sendError(res, 404, "Post not found", "POST_NOT_FOUND");
    }

    // Update content
    if (req?.body?.content) {
      post.content = req.body.content;
    }

    // Handle image update if provided
    if (req.file) {
      // Delete old image from Cloudinary
      if (post.file && post.file.name) {
        try {
          await cloudinary.uploader.destroy(post.file.name);
        } catch (err) {
          console.log("Error deleting old image:", err);
        }
      }

      // Upload new image
      const uploadFileURL = await fileUpload(req.file.path);
      fs.unlinkSync(req.file.path);

      post.file = {
        name: req.file.filename,
        url: uploadFileURL,
      };
    }

    const updatedPost = await post.save();
    await updatedPost.populate("user", "name profile_pic");

    const commentsCount = await commentModel.countDocuments({
      post: postId,
    });

    sendSuccess(res, 200, "Post updated successfully", {
      post: {
        id: updatedPost._id,
        content: updatedPost.content,
        file: updatedPost.file,
        user: {
          id: updatedPost.user._id,
          name: updatedPost.user.name,
        },
        likesCount: updatedPost.likes.length,
        commentsCount: commentsCount,
        createdAt: updatedPost.createdAt,
        updatedAt: updatedPost.updatedAt,
      },
    });
  } catch (error) {
    console.log(error);
    sendError(res, 500, "Something went wrong, please try again later", "SERVER_ERROR");
  }
};

// Delete post
exports.deletePost = async (req, res) => {
  try {
    const { id: postId } = req.params;

    const post = await postModel.findById(postId);

    if (!post) {
      return sendError(res, 404, "Post not found", "POST_NOT_FOUND");
    }

    // Check authorization (owner or admin)
    if (
      post.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return sendError(res, 403, "You are not authorized to delete this post", "UNAUTHORIZED_DELETE");
    }

    // Delete image from Cloudinary
    if (post.file && post.file.name) {
      try {
        await cloudinary.uploader.destroy(post.file.name);
      } catch (err) {
        console.log("Error deleting image:", err);
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

// Like/Unlike post
exports.likePost = async (req, res) => {
  try {
    const { id: postId } = req.params;

    const post = await postModel.findById(postId);
    console.log(post)
    if (!post) {
      return sendError(res, 404, "Post not found", "POST_NOT_FOUND");
    }

    const userId = req.user._id.toString();
    const userIndex = post.likes.findIndex(
      (id) => id.toString() === userId
    );

    if (userIndex > -1) {
      // Unlike - remove user from likes
      post.likes.splice(userIndex, 1);
    } else {
      // Like - add user to likes
      post.likes.push(req.user._id);
    }

    const updatedPost = await post.save();

    sendSuccess(
      res,
      200,
      userIndex > -1 ? "Post unliked successfully" : "Post liked successfully",
      {
        post: {
          id: updatedPost._id,
          likesCount: updatedPost.likes.length,
          isLiked: userIndex === -1, // true if just liked, false if just unliked
        },
      }
    );
  } catch (error) {
    console.log(error);
    sendError(res, 500, "Something went wrong, please try again later", "SERVER_ERROR");
  }
}