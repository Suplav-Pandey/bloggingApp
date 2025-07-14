const upload= require("../config/multer");

//middleware for handling errors on multer, cloudinary uploads
const fileUpload=(req, res, next) => {
        upload.single('file')(req, res, function (err) {
            //custom error handler for multer specificaly
            if (err) return res.status(400).json({ error: err.message });
            next();
        });
    }

module.exports=fileUpload;