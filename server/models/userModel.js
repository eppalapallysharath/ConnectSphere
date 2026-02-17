const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    name:{
        type:String, required:true, trim: true
    },
    email:{type:String, required:true, unique:true, trim:true},
    password:{type:String, required:true},
    role:{type:String, enum:["admin", "user"], required:true, default:"user"},
    profile_pic:{
        file_name: {type:String , default:"default_icon.png"},
        url:{type:String, default:"https://img.icons8.com/?size=100&id=tZuAOUGm9AuS&format=png&color=000000"}
    },
    bio:{type:String},
    isBlocked:{
        type: Boolean, 
        default:false
    }
},{timestamps:true})

const userModel = mongoose.model("users", userSchema)
module.exports = {userModel}