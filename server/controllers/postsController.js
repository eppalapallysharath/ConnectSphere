const {fileUpload} = require("../utils/fileupload.js")
const fs = require("fs")
const postModel = require("../models/postsModel.js")

exports.createPosts = async(req, res)=>{
    try {
        const {content} = req.body
        const uploadFileURL = await fileUpload(req.file.path)
        fs.unlinkSync(req.file.path)
        const create = await postModel.create({
            user:req.user._id,
            content:content,
            file:{
                name:req.file.filename,
                url:uploadFileURL
            }
        })
        res.status(201).json(create)
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
} 


exports.getMyOwnPosts = async(req, res)=>{
    try {
        const allPosts = await postModel.find({user:req.user._id}).populate("user")
        res.send(allPosts)
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
}