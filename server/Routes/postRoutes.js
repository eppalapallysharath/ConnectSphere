const express = require("express");
const router = express.Router()
const {
  createPosts,
  getMyOwnPosts,
  getAllPosts,
  getSinglePost,
  updatePost,
  deletePost,
  likePost
} = require("../controllers/postsController.js")
const {uploads} = require("../config/multer.js")
const {tokenCheck} = require("../validations/authValidations.js")
const {createPostCheck, updatePostCheck, postIdValidation} = require("../validations/postValidations.js")
const {validation} = require("../middlewares/validationMiddleware.js");
const { authentication, authorization } = require("../middlewares/auth.js");

// Post creation
router.post("/createPost", tokenCheck, uploads.single("image/video"), createPostCheck, validation, authentication, authorization("user", "admin"), createPosts)

// Get user's own posts (must come before /:id routes)
router.get("/myPosts", tokenCheck, validation, authentication, authorization("user", "admin"), getMyOwnPosts)

// Get all posts
router.get("/", getAllPosts)

// Post-specific operations
router.put("/:id/like", tokenCheck, postIdValidation, validation, authentication, authorization("user"), likePost)
router.put("/:id", tokenCheck, uploads.single("image/video"), updatePostCheck, validation, authentication, authorization("user"), updatePost)
router.delete("/:id", tokenCheck, postIdValidation, validation, authentication, authorization("user", "admin"), deletePost)
router.get("/:id", postIdValidation, validation, getSinglePost)

module.exports = router