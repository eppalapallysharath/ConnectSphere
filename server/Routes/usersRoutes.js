const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
} = require("../controllers/usersController.js");
const { tokenCheck } = require("../validations/authValidations.js");
const { uploads } = require("../config/multer.js");
const { validation } = require("../middlewares/validationMiddleware.js");
const { authentication, authorization } = require("../middlewares/auth.js");

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User profile and management
 */

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 users: { type: array, items: { type: object } }
 *       403:
 *         description: Forbidden
 */
router.get(
  "/",
  tokenCheck,
  validation,
  authentication,
  authorization("admin"),
  getAllUsers,
);

/**
 * @swagger
 * /api/v1/users/update:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               bio: { type: string }
 *               profilePic: { type: string, format: binary }
 *     responses:
 *       200:
 *         description: Profile updated
 */
router.put(
  "/update",
  tokenCheck,
  uploads.single("profilePic"),
  validation,
  authentication,
  authorization("user", "admin"),
  updateUserProfile,
);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *     summary: Get user profile by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User profile info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 user: { type: object }
 */
router.get("/:id", getUserProfile);

module.exports = router;
