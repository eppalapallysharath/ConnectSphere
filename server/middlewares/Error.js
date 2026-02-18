exports.errorMiddleware = (error, req, res , next)=>{
    res.status(error.statusCode).json(error)
}