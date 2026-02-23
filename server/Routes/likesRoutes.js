const express = require("express");
const router = express.Router();
const { likePost } = require("../controllers/postsController.js");
const { tokenCheck } = require("../validations/authValidations.js");
const { validation } = require("../middlewares/validationMiddleware.js");
const { authentication, authorization } = require("../middlewares/auth.js");

/**
 * @swagger
 * tags:
 *   name: Likes
 *   description: Like management for posts
 */

/**
 * @swagger
 * /api/v1/likes/{postId}:
 *   put:
 *     summary: Like/Unlike post
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post liked/unliked
 */
router.put("/:postId", tokenCheck, validation, authentication, authorization("user", "admin"), likePost);

module.exports = router;

