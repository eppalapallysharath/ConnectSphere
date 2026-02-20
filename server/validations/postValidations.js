const  {body, check, param} = require("express-validator")

exports.createPostCheck = [
    body("content").exists().withMessage("missing content field").isLength({min:3, max:200}).withMessage("please enter minimum 3 characters and maximum allowed characters are 200"),
    check("image/video").custom((value, { req }) => {
    if (!req.file) {
      throw new Error("image/video file is required");
    }
    return true;
  }),
]

exports.updatePostCheck = [
    body("content").optional().isLength({min:3, max:200}).withMessage("please enter minimum 3 characters and maximum allowed characters are 200"),
]

exports.addCommentCheck = [
    body("text").exists().withMessage("text field is missing").isLength({min:1, max:500}).withMessage("comment must be between 1 and 500 characters"),
    param("id").isMongoId().withMessage("Invalid post ID"),
]

exports.postIdValidation = [
    param("id").isMongoId().withMessage("Invalid post ID"),
]

exports.commentIdValidation = [
    param("id").isMongoId().withMessage("Invalid comment ID"),
]