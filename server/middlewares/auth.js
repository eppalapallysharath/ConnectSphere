const jwt = require("jsonwebtoken");
require("dotenv").config();
const { decodedToken } = require("../utils/users.js");
const { response } = require("express");
const { userModel } = require("../models/userModel.js");

exports.authentication = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const token = authorization.split(" ")[1];
    const decodeToken = await decodedToken(token);
    const user = await userModel.findOne({ email: decodeToken.email });
    req.user = user;
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      statusCode: 400,
      message: error.message,
      error: {
        code: error.name,
      },
    });
  }
};

exports.authorization = function(...roles){
    return (req, res, next)=>{
        const {role} = req.user
        const checkRole = roles.includes(role)
        if(checkRole){
            next()
        }else{
            res.status(403).json({success:false, message: "Unauthorized user",
                statusCode: 403,
                error:{
                    code:"UNAUTHORIZED_USER"
                }
            })
        }
    }
}
