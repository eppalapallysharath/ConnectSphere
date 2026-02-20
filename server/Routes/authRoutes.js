const express = require("express")
const router = express.Router()
const {register, login, profile} = require("../controllers/authController.js")
const  {registerValidationsChecks, loginChecks, profileChecks} = require("../validations/authValidations.js")
const {validation} = require("../middlewares/validationMiddleware.js")
const {authentication, authorization} = require("../middlewares/auth.js")

router.post("/register", registerValidationsChecks, validation, register)
router.post("/login", loginChecks, validation, login)
router.get("/profile", profileChecks, validation, authentication, authorization("user", "admin"), profile)


module.exports = router