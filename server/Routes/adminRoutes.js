const express = require("express");
const router = express.Router();
const {
  blockUser,
  unblockUser,
  deletePost,
  deleteComment,
  getAllPosts,
  getAnalytics
} = require("../controllers/adminController.js");
const { tokenCheck } = require("../validations/authValidations.js");
const { validation } = require("../middlewares/validationMiddleware.js");
const { authentication, authorization } = require("../middlewares/auth.js");

// User management
router.put("/users/block/:id", tokenCheck, validation, authentication, authorization("admin"), blockUser);
router.put("/users/unblock/:id", tokenCheck, validation, authentication, authorization("admin"), unblockUser);

// Content moderation
router.delete("/posts/:id", tokenCheck, validation, authentication, authorization("admin"), deletePost);
router.delete("/comments/:id", tokenCheck, validation, authentication, authorization("admin"), deleteComment);

// Posts and Analytics
router.get("/posts", tokenCheck, validation, authentication, authorization("admin"), getAllPosts);
router.get("/analytics", tokenCheck, validation, authentication, authorization("admin"), getAnalytics);

module.exports = router;
