const express = require("express");
const app = express()
require("dotenv").config()
const {connectDB} = require("./config/db.js")
connectDB()

app.get("/", (req, res)=>{
    res.send("hi, im running fine")
})

app.listen(process.env.PORT, ()=>{
    console.log("server started on port "+ process.env.PORT)
})