const express = require("express");
const app = express()
require("dotenv").config()
const {connectDB} = require("./config/db.js")
connectDB()
const authRoutes = require("./Routes/authRoutes.js")
const {errorMiddleware} = require("./middlewares/Error.js")
const postsRoutes = require("./Routes/postRoutes.js")

app.use(express.json())
app.use(express.urlencoded(true))

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/posts", postsRoutes)

app.get("/", (req, res)=>{
    res.send("hi, im running fine")
})

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: "Api not found",
    error: {
      code: "API_NOT_FOUND",
    },
  });
});


// global error handling middleware
app.use(errorMiddleware)

app.listen(process.env.PORT, ()=>{
    console.log("server started on port "+ process.env.PORT)
})