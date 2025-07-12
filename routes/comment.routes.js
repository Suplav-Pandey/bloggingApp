const {Router}= require("express");
const authe = require("../middleware/authe");
const { handleListBlogComments, handleListUserComments, handleCreateComment, handleEditComment, handleDeleteComment } = require("../controllers/comment.controllers");
const {body}= require("express-validator");
const router= Router();

router.get("/listBlogComments/:blogId", handleListBlogComments);//list all comments associated with a blog

router.use(authe);//user can comment only if he is logged in 

router.get("/listUserComments", handleListUserComments);//list all comments done by this user

router.post("/createComment/:blogId", [
    body('body').trim().isLength({min : 2}).withMessage("comment must be at least 2 char long"),
], handleCreateComment);//create a new comment on a blog

router.post("/editComment/:id", [
    body('body').optional().trim().isLength({min : 2}).withMessage("comment must be at least 2 char long"),
] ,handleEditComment);//edit own comment on a blog

router.post("/deleteComment/:id", handleDeleteComment);//delete own comment on a blog

module.exports=router;