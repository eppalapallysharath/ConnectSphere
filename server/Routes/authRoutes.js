const express = require("express")
const router = express.Router()
const {register, login, me} = require("../controllers/authController.js")
const  {registerValidationsChecks} = require("../validations/authValidations.js")
const {validation} = require("../middlewares/validationMiddleware.js")

router.post("/register", registerValidationsChecks, validation, register)
router.post("/login", login)
router.get("/me", me)


module.exports = router