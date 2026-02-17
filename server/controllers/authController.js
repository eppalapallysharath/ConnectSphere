const {userModel} = require("../models/userModel.js")
exports.register = async(req, res) =>{
    try {
        console.log(req.body)
        const {name, password, email} = req.body
        const newDoc = await userModel.create({
            name:name, password:password, email:email
        })
        res.status(200).json(newDoc)
    } catch (error) {
        console.log(error)
        res.status(400).json({message:"something went wrong"})
    }
}

exports.login  =(req, res) =>{
    res.send("login")
}

exports.me = (req, res) =>{
    res.send("me user")
}