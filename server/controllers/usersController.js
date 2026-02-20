const { userModel } = require("../models/userModel.js");
const { fileUpload } = require("../utils/fileupload.js");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const { sendSuccess, sendError } = require("../utils/responseHandler.js");

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const { id: userId } = req.params;

    const user = await userModel.findById(userId).select("-password");

    if (!user) {
      return sendError(res, 404, "User not found", "USER_NOT_FOUND");
    }

    if (user.isBlocked) {
      return sendError(res, 403, "This user account has been blocked", "USER_BLOCKED");
    }

    sendSuccess(
      res,
      200,
      "User profile fetched successfully",
      {
        id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        role: user.role,
        profile_pic: user.profile_pic,
        createdAt: user.createdAt,
      }
    );
  } catch (error) {
    console.log(error);
    sendError(res, 500, "Something went wrong, please try again later", "SERVER_ERROR");
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const { name, bio } = req.body;
    const userId = req.user._id;

    const updateData = {};
    if (name) updateData.name = name;
    if (bio) updateData.bio = bio;

    // Handle profile picture upload
    if (req.file) {
      // Delete old profile picture from Cloudinary if exists
      const user = await userModel.findById(userId);
      if (user.profile_pic.file_name && user.profile_pic.file_name !== "default_icon.png") {
        try {
          await cloudinary.uploader.destroy(user.profile_pic.file_name);
        } catch (err) {
          console.log("Error deleting old profile pic:", err);
        }
      }

      // Upload new profile picture
      const uploadFileURL = await fileUpload(req.file.path);
      fs.unlinkSync(req.file.path);

      updateData.profile_pic = {
        file_name: req.file.filename,
        url: uploadFileURL,
      };
    }

    const updatedUser = await userModel.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select("-password");

    sendSuccess(
      res,
      200,
      "Profile updated successfully",
      {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        bio: updatedUser.bio,
        profile_pic: updatedUser.profile_pic,
      }
    );
  } catch (error) {
    console.log(error);
    sendError(res, 500, "Something went wrong, please try again later", "SERVER_ERROR");
  }
};

// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const users = await userModel
      .find()
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip(skip);

    const totalUsers = await userModel.countDocuments();

    sendSuccess(
      res,
      200,
      "Users fetched successfully",
      {
        users: users.map((user) => ({
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isBlocked: user.isBlocked,
          profile_pic: user.profile_pic,
          createdAt: user.createdAt,
        })),
      },
      {
        page: parseInt(page),
        limit: parseInt(limit),
        totalRecords: totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
      }
    );
  } catch (error) {
    console.log(error);
    sendError(res, 500, "Something went wrong, please try again later", "SERVER_ERROR");
  }
};
