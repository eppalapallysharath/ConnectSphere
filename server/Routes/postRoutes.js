const express = require("express");
const router = express.Router();
const {
  createPosts,
  getMyOwnPosts,
  getAllPosts,
  getSinglePost,
  updatePost,
  deletePost,
  likePost,
  getUserPosts,
} = require("../controllers/postsController.js");
const { uploads } = require("../config/multer.js");
const { tokenCheck } = require("../validations/authValidations.js");
const {
  createPostCheck,
  updatePostCheck,
  postIdValidation,
} = require("../validations/postValidations.js");
const { validation } = require("../middlewares/validationMiddleware.js");
const { authentication, authorization } = require("../middlewares/auth.js");

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Post management
 */

/**
 * @swagger
 * /api/v1/posts/createPost:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               image/video:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Post created successfully
 */
router.post(
  "/createPost",
  tokenCheck,
  uploads.single("image/video"),
  createPostCheck,
  validation,
  authentication,
  authorization("user", "admin"),
  createPosts,
);

/**
 * @swagger
 * /api/v1/posts/myPosts:
 *   get:
 *     summary: Get user's own posts
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's posts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 posts: { type: array, items: { type: object } }
 */
router.get(
  "/myPosts",
  tokenCheck,
  validation,
  authentication,
  authorization("user", "admin"),
  getMyOwnPosts,
);

/**
 * @swagger
 * /api/v1/posts:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: List of all posts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 posts: { type: array, items: { type: object } }
 */
router.get("/", getAllPosts);

/**
 * @swagger
 * /api/v1/posts/user/{userId}:
 *   get:
 *     summary: Get posts by user ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of posts for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 posts: { type: array, items: { type: object } }
 */
router.get("/user/:userId", getUserPosts);

/**
 * @swagger
 * /api/v1/posts/{id}/like:
 *   put:
 *     summary: Like/Unlike a post
 *     tags: [Posts]
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
 *         description: Post liked/unliked
 */
router.put(
  "/:id/like",
  tokenCheck,
  postIdValidation,
  validation,
  authentication,
  authorization("user"),
  likePost,
);

/**
 * @swagger
 * /api/v1/posts/{id}:
 *   put:
 *     summary: Update a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               content: { type: string }
 *               image/video: { type: string, format: binary }
 *     responses:
 *       200:
 *         description: Post updated
 */
router.put(
  "/:id",
  tokenCheck,
  uploads.single("image/video"),
  updatePostCheck,
  validation,
  authentication,
  authorization("user"),
  updatePost,
);

/**
 * @swagger
 * /api/v1/posts/{id}:
 *   delete:
 *     summary: Delete a post
 *     tags: [Posts]
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
 *         description: Post deleted
 */
router.delete(
  "/:id",
  tokenCheck,
  postIdValidation,
  validation,
  authentication,
  authorization("user", "admin"),
  deletePost,
);

/**
 * @swagger
 * /api/v1/posts/{id}:
 *   get:
 *     summary: Get single post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 post: { type: object }
 */
router.get("/:id", postIdValidation, validation, getSinglePost);

module.exports = router;
