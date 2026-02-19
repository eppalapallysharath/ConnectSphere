const  {body,check} = require("express-validator")
exports.createPostCheck = [
    body("content").exists().withMessage("missing content field").isLength({min:3, max:200}).withMessage("please enter minimum 3 characters and maximum allowed characters are 200"),
    check("image/video").custom((value, { req }) => {
    if (!req.file) {
      throw new Error("image/video file is required");
    }
    return true;
  }),

]