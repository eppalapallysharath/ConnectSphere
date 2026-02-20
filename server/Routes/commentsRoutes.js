const express = require("express");
const router = express.Router();
const { addComment, getComments, deleteComment } = require("../controllers/commentsController.js");
const { tokenCheck } = require("../validations/authValidations.js");
const { postIdValidation, addCommentCheck } = require("../validations/postValidations.js");
const { validation } = require("../middlewares/validationMiddleware.js");
const { authentication, authorization } = require("../middlewares/auth.js");

// Add comment to a post
router.post("/:id/comment", tokenCheck, addCommentCheck, validation, authentication, authorization("user"), addComment);

// Get all comments for a post
router.get("/:id/comments", postIdValidation, validation, getComments);

// Delete comment
router.delete("/:id", tokenCheck, validation, authentication, authorization("user", "admin"), deleteComment);

module.exports = router;
