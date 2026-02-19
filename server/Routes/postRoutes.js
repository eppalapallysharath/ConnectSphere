const express = require("express");
const router = express.Router()
const {createPosts, getMyOwnPosts} = require("../controllers/postsController.js")
const {uploads} = require("../config/multer.js")
const {tokenCheck} = require("../validations/authValidations.js")
const {createPostCheck} = require("../validations/postValidations.js")
const {validation} = require("../middlewares/validationMiddleware.js");
const { authentication, authorization } = require("../middlewares/auth.js");

router.post("/createPost",tokenCheck, uploads.single("image/video"),createPostCheck, validation, authentication, authorization("user"),createPosts)
router.get("/getOwnPost", tokenCheck, validation, authentication, authorization("user"), getMyOwnPosts)


module.exports = router