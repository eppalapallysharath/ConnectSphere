const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

exports.generateHash =  async(payload, salting)=>{
    const hash = await bcryptjs.hash(payload, salting)
    return hash
}

exports.generateToken = async (payload)=>{
    return await jwt.sign(payload, process.env.JWT_SECRET_KEY, {expiresIn:process.env.JWT_EXPIRE})
}

exports.decodedToken = async (payload) => {
    return await jwt.verify(payload, process.env.JWT_SECRET_KEY)
}