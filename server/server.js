const express = require("express");
const app = express()
require("dotenv").config()
const {connectDB} = require("./config/db.js")
connectDB()
const authRoutes = require("./Routes/authRoutes.js")

app.use(express.json())
app.use(express.urlencoded(true))

app.use("/api/v1/auth", authRoutes)

app.get("/", (req, res)=>{
    res.send("hi, im running fine")
})

app.use((req, res) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: "Api not found",
    error: {
      code: "API_NOT_FOUND",
    },
  });
});




app.listen(process.env.PORT, ()=>{
    console.log("server started on port "+ process.env.PORT)
})