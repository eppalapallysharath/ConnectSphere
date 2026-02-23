const express = require("express");
const router = express.Router();
const {
  addComment,
  getComments,
  deleteComment,
} = require("../controllers/commentsController.js");
const { tokenCheck } = require("../validations/authValidations.js");
const {
  postIdValidation,
  addCommentCheck,
} = require("../validations/postValidations.js");
const { validation } = require("../middlewares/validationMiddleware.js");
const { authentication, authorization } = require("../middlewares/auth.js");

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Comment management for posts
 */

/**
 * @swagger
 * /api/v1/comments/{id}/comment:
 *   post:
 *     summary: Add comment to a post
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Post ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text: { type: string }
 *     responses:
 *       201:
 *         description: Comment added
 */
router.post(
  "/:id/comment",
  tokenCheck,
  addCommentCheck,
  validation,
  authentication,
  authorization("user"),
  addComment,
);

/**
 * @swagger
 * /api/v1/comments/{id}/comments:
 *   get:
 *     summary: Get all comments for a post
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Post ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 comments: { type: array, items: { type: object } }
 */
router.get("/:id/comments", postIdValidation, validation, getComments);

/**
 * @swagger
 * /api/v1/comments/{id}:
 *   delete:
 *     summary: Delete comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Comment ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment deleted
 */
router.delete(
  "/:id",
  tokenCheck,
  validation,
  authentication,
  authorization("user", "admin"),
  deleteComment,
);

module.exports = router;
