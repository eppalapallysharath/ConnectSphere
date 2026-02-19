exports.errorMiddleware = (error, req, res , next)=>{
    console.log(error)
    res.status(error.statusCode).json(error)
}