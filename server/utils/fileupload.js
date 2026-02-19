const {cloudinary} = require("../config/cloudinary")


exports.fileUpload= async(file) =>{
    const data = await cloudinary.uploader.upload(file,{
        resource_type:"raw",
        folder:"connectSphere"
    })
    return data.url
}