const mongoose =require("mongoose");
const postSchema = new mongoose.Schema({
    user:{type: mongoose.Types.ObjectId, ref:"users", required:true},
    content:{type: String, required:true},
    file:{
        name:{type:String, required:true},
        url:{
            type:String, required:true
        }
    },
    likes:[mongoose.Types.ObjectId]
},{timestamps:true})

module.exports = mongoose.model("posts", postSchema)