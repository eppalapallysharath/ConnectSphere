const { userModel } = require("../models/userModel.js");
const bcryptjs = require("bcryptjs")
const {generateHash, generateToken} = require("../utils/users.js")

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const checkEmail = await userModel.findOne({ email: email });
    if (checkEmail) {
      res.status(409).json({
        success: false,
        statusCode: 409,
        message: "User already exists with mail id",
        error: {
          code: "USER_EXISTS",
        },
      });
    }else{
        const hashPassword = await generateHash(password, 12)
        const newDoc = await userModel.create({email:email, name:name, password: hashPassword})
        res.status(201).json({
            success:true,
            statusCode:201,
            message:"Account created successfully",
            data:{
                name:newDoc.name,
                email:newDoc.email,
                role:newDoc.role,
                profile_pic:newDoc.profile_pic
            }
        })
    }
  } catch (error) {
    console.log(error)
    res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Something went wrong, please try again latter",
        error: {
          code: "SOMETHING_WENT_WRONG",
        },
      })
  }
};

exports.login = async(req, res) => {
  try {
    const {email, password} = req.body
    const checkAccountExist = await userModel.findOne({email:email},{createdAt:false, updatedAt:false})
    if(!checkAccountExist){
        const response = {
            success:false,
            statusCode:404,
            message:"user not exists",
            error:{
                code:"USER_NOT_EXISTS"
            }
        }
        return res.status(response.statusCode).json(response)
    }
    if(checkAccountExist.isBlocked){
        const response = {
            success:false,
            statusCode:403,
            message:"Account blocked by admin",
            error:{
                code:"ACCOUNT_BLOCKED"
            }
        }
        return res.status(response.statusCode).json(response)
    }
    const checkPassword = await bcryptjs.compare(password, checkAccountExist.password)
    if(checkPassword){
        const token = await generateToken({email:checkAccountExist.email, name:checkAccountExist.name})
        const response = {
            success:true,
            statusCode:200,
            message:"Login successfully",
            data:{
               user: {name: checkAccountExist.name,
                email: checkAccountExist.email,
                role: checkAccountExist.role,
                profile_pic:checkAccountExist.profile_pic
            },
            token:token
        }
        }
        return res.status(response.statusCode).json(response)
    }else{
        const response = {
            success:false,
            statusCode:401,
            message:"Invalid Email/password",
            error:{
                code:"INVALID EMAIL/PASSWORD"
            }
        } 
        return res.status(response.statusCode).json(response)
    }

  } catch (error) {
    console.log(error)
    res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Something went wrong, please try again latter",
        error: {
          code: "SOMETHING_WENT_WRONG",
        },
      })
  }
};

exports.profile = async (req, res) => {
    const userData = await userModel.findById(req.user._id, {isBlocked:false})
  res.status(200).json({success:true,
        statusCode:200,
        message:"Fetched profile info",
        data:{
            user:userData
        }
   })
};
