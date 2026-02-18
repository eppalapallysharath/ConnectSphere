const { body, param, query, header } = require("express-validator");

exports.registerValidationsChecks = [
  body("name").exists()
    .withMessage("name field is missing")
    .isAlphanumeric("en-US", { ignore: " " })
    .withMessage(
      "special characters are not allowed. only a-z, A-Z, 0-9 are allowed",
    )
    .isLength({ min: 3, max: 50 })
    .withMessage(
      "please enter name should have minimum 3 characters and maximum 50 character are allowed",
    ),
  body('email').exists()
  .withMessage("email field is missing")
    .isEmail().withMessage("please enter valid email"),
    body('password').exists()
    .withMessage("password field is missing")
    .isStrongPassword().withMessage("at least 8 characters, one lowercase, one uppercase, one number, and one symbol")
];

exports.loginChecks = [
  body("email").exists().withMessage("email field is missing").isEmail().withMessage("Please enter valid email"),
  body("password").exists().withMessage("password field is missing").isStrongPassword().withMessage("at least 8 characters, one lowercase, one uppercase, one number, and one symbol")
]

exports.profileChecks=[
  header("Authorization").exists().withMessage("Authorization field is missing").custom(value => value.startsWith("Bearer")).withMessage("User Bearer keyword before token")  
]