const express = require("express");
const app = express()
require("dotenv").config()
const {connectDB} = require("./config/db.js")
connectDB()

const authRoutes = require("./Routes/authRoutes.js")
const postRoutes = require("./Routes/postRoutes.js")
const commentsRoutes = require("./Routes/commentsRoutes.js")
const likesRoutes = require("./Routes/likesRoutes.js")
const usersRoutes = require("./Routes/usersRoutes.js")
const adminRoutes = require("./Routes/adminRoutes.js")
const {errorMiddleware} = require("./middlewares/Error.js")

app.use(express.json())
app.use(express.urlencoded(true))

// Routes
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/posts", postRoutes)
app.use("/api/v1/comments", commentsRoutes)
app.use("/api/v1/likes", likesRoutes)
app.use("/api/v1/users", usersRoutes)
app.use("/api/v1/admin", adminRoutes)

app.get("/", (req, res)=>{
    res.send("ConnectSphere API - Server running fine")
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