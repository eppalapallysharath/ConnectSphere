const multer = require("multer")

const storage = multer.diskStorage({
    destination:(req, file, cb)=>{
        cb(null, "./uploads")
    },
    filename:(req, file, cb)=>{
        cb(null, Date.now()+file.originalname)
    }
})


const uploads = multer({
    storage: storage,
    limits:1024*1024*10,
    fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    }else if(file.mimetype.startsWith("video/")){
        cb(null, true)
    }
    else {
        const error = new Error()
        error.statusCode= 427
        error.message = "Only image/videos are supported"
        error.error={
                code:"VALIDATION_ERROR",
                details:"Only image/videos are supported"
            }
      cb(error, false);
    }
  }

})

module.exports ={uploads}


