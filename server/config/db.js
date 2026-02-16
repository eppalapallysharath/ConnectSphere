const mongoose = require("mongoose")
require("dotenv").config()

async function connectDB (){
    try {
      await mongoose.connect(process.env.MONGO_URI, {dbName:process.env.MONGO_DBNAME})
      console.log("database is connected")  
    } catch (error) {
        console.log(error)
    }
}

module.exports={connectDB}