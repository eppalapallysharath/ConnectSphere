const express = require("express");
const router = express.Router();
const { likePost } = require("../controllers/postsController.js");
const { tokenCheck } = require("../validations/authValidations.js");
const { validation } = require("../middlewares/validationMiddleware.js");
const { authentication, authorization } = require("../middlewares/auth.js");

// Like/Unlike post
router.put("/:postId", tokenCheck, validation, authentication, authorization("user", "admin"), likePost);

module.exports = router;
