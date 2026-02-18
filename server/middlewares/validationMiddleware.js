const {validationResult} = require("express-validator")

exports.validation = (req, res, next) =>{
    const validationError = validationResult(req)
    if(!validationError.isEmpty()){
        const error = {
            success:false,
            statusCode:422,
            message:"validation failed",
            error:{
                code:"VALIDATION_ERROR",
                details: validationError.errors
            }
        }
        next(error)
        // res.status(422).json({
        //     success:false,
        //     statusCode:422,
        //     message:"validation failed",
        //     error:{
        //         code:"VALIDATION_ERROR",
        //         details: validationError.errors
        //     }
        // })
    }
    next()
}