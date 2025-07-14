// config/multer.js
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary= require("./cloudinary");

// Set up Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "BloggingWeb", // Folder name in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 450, height: 450, crop: "limit" }], // optional
  },
});

// Initialize Multer with Cloudinary storage
const upload = multer({ storage });

module.exports = upload;
