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

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Administrative operations
 */

/**
 * @swagger
 * /api/v1/admin/users/block/{id}:
 *   put:
 *     summary: Block a user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User blocked
 */
router.put("/users/block/:id", tokenCheck, validation, authentication, authorization("admin"), blockUser);

/**
 * @swagger
 * /api/v1/admin/users/unblock/{id}:
 *   put:
 *     summary: Unblock a user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User unblocked
 */
router.put("/users/unblock/:id", tokenCheck, validation, authentication, authorization("admin"), unblockUser);

/**
 * @swagger
 * /api/v1/admin/posts/{id}:
 *   delete:
 *     summary: Delete any post (Admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post deleted by admin
 */
router.delete("/posts/:id", tokenCheck, validation, authentication, authorization("admin"), deletePost);

/**
 * @swagger
 * /api/v1/admin/comments/{id}:
 *   delete:
 *     summary: Delete any comment (Admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment deleted by admin
 */
router.delete("/comments/:id", tokenCheck, validation, authentication, authorization("admin"), deleteComment);

/**
 * @swagger
 * /api/v1/admin/posts:
 *   get:
 *     summary: Get all posts (Admin view)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all posts
 */
router.get("/posts", tokenCheck, validation, authentication, authorization("admin"), getAllPosts);

/**
 * @swagger
 * /api/v1/admin/analytics:
 *   get:
 *     summary: Get platform analytics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Platform analytics data
 */
router.get("/analytics", tokenCheck, validation, authentication, authorization("admin"), getAnalytics);

module.exports = router;

