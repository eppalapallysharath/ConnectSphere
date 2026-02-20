const { body, param, query } = require("express-validator");

exports.updateUserProfileCheck = [
  body("name").optional().isAlphanumeric("en-US", { ignore: " " }).withMessage("special characters are not allowed in name").isLength({ min: 3, max: 50 }).withMessage("name should have minimum 3 characters and maximum 50 characters"),
  body("bio").optional().isLength({ max: 500 }).withMessage("bio should be maximum 500 characters"),
];

exports.userIdValidation = [
  param("id").isMongoId().withMessage("Invalid user ID"),
];

exports.paginationValidation = [
  query("page").optional().isInt({ min: 1 }).withMessage("page should be a positive integer"),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("limit should be between 1 and 100"),
];
