const express = require("express");
const router = express.Router();
const { getUserProfile, updateUserProfile, getAllUsers } = require("../controllers/usersController.js");
const { tokenCheck } = require("../validations/authValidations.js");
const { uploads } = require("../config/multer.js");
const { validation } = require("../middlewares/validationMiddleware.js");
const { authentication, authorization } = require("../middlewares/auth.js");

// Get all users (Admin only)
router.get("/", tokenCheck, validation, authentication, authorization("admin"), getAllUsers);

// Update user profile
router.put("/update", tokenCheck, uploads.single("profilePic"), validation, authentication, authorization("user", "admin"), updateUserProfile);

// Get user profile by ID (this should be last to avoid matching other routes)
router.get("/:id", getUserProfile);

module.exports = router;
