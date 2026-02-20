const { userModel } = require("../models/userModel.js");
const bcryptjs = require("bcryptjs")
const {generateHash, generateToken} = require("../utils/users.js")
const {sendSuccess, sendError} = require("../utils/responseHandler.js")

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const checkEmail = await userModel.findOne({ email: email });
    if (checkEmail) {
      return sendError(res, 409, "User already exists", "USER_EXISTS");
    }

    const hashPassword = await generateHash(password, 12)
    const newDoc = await userModel.create({
      email: email,
      name: name,
      password: hashPassword
    })

    const token = await generateToken({ email: newDoc.email, name: newDoc.name })

    sendSuccess(res, 201, "User registered successfully", {
      user: {
        id: newDoc._id,
        name: newDoc.name,
        email: newDoc.email,
        role: newDoc.role
      },
      accessToken: token
    })
  } catch (error) {
    console.log(error)
    sendError(res, 500, "Something went wrong, please try again later", "SERVER_ERROR")
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body
    const checkAccountExist = await userModel.findOne({ email: email })

    if (!checkAccountExist) {
      return sendError(res, 401, "Invalid email or password", "INVALID_CREDENTIALS");
    }

    if (checkAccountExist.isBlocked) {
      return sendError(res, 403, "Account blocked by admin", "ACCOUNT_BLOCKED");
    }

    const checkPassword = await bcryptjs.compare(password, checkAccountExist.password)

    if (!checkPassword) {
      return sendError(res, 401, "Invalid email or password", "INVALID_CREDENTIALS");
    }

    const token = await generateToken({ email: checkAccountExist.email, name: checkAccountExist.name })

    sendSuccess(res, 200, "Login successful", {
      user: {
        id: checkAccountExist._id,
        name: checkAccountExist.name,
        email: checkAccountExist.email,
        role: checkAccountExist.role
      },
      accessToken: token
    })

  } catch (error) {
    console.log(error)
    sendError(res, 500, "Something went wrong, please try again later", "SERVER_ERROR")
  }
};



exports.profile = async (req, res) => {
  try {
    const userData = await userModel.findById(req.user._id,{password:false, isBlocked:false})
    sendSuccess(res, 200, "Fetched profile info", {
      user: userData
    })
  } catch (error) {
    console.log(error)
    sendError(res, 500, "Something went wrong, please try again later", "SERVER_ERROR")
  }
};
