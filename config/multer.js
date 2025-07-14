// config/multer.js
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary= require("./cloudinary");

// Set up Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "user-uploads", // Folder name in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 500, height: 500, crop: "limit" }], // optional
  },
});

// Initialize Multer with Cloudinary storage
const upload = multer({ storage });

module.exports = upload;
