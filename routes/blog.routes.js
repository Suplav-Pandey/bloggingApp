const {Router}= require("express");
const {body}= require("express-validator");
const authe = require("../middleware/authe");
const { handleAllBlogsListing, handleBlogView, handleBlogCreation, handleBlogEdit, handleBlogDelete, handleUserBlogsListing } = require("../controllers/blog.controllers");
const router=Router();

//we can: create, edit, delete, view-> coonsider it tommarow
router.get("/listAll", handleAllBlogsListing);
router.get("/view/:id", handleBlogView);

router.use(authe); //below all functionalities are only accessable to logined user

router.get("/listUser", handleUserBlogsListing);

router.post("/create", [
    body('title').trim().isLength({min:3}).withMessage("title must be at least 3 character long"),
    body('desc').trim().isLength({min:5}).withMessage("Desc must be at least 5 character long"),
    body('body').trim().isLength({min:30}).withMessage("body must be at least 30 character long"),
    // body('coverImgUrl').trim().isURL().withMessage("cover image must be a valid URL")
], upload.single('file') ,handleBlogCreation);

router.post("/edit/:id", [
    body('title').optional({ checkFalsy: true }).trim().isLength({min:3}).withMessage("title must be at least 3 character long"),
    body('desc').optional({ checkFalsy: true }).trim().isLength({min:5}).withMessage("Desc must be at least 5 character long"),
    body('body').optional({ checkFalsy: true }
    ).trim().isLength({min:30}).withMessage("body must be at least 30 character long"),
    // body('coverImgUrl').optional().trim().isURL().withMessage("cover image must be a valid URL")
], upload.single('file') ,handleBlogEdit);

router.post("/delete/:id", handleBlogDelete);

module.exports= router;
