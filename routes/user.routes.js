const {Router}=  require("express");
const { handleUserRegister, handleUserLogin, handleUserLogout, handleViewProfile, handleEditProfile, handleUserdelete } = require("../controllers/user.controllers");
const {body}= require("express-validator");
const upload= require("../config/multer");
const authe= require("../middleware/authe");
const router = Router();

router.post("/register", 
    [
        body('username.firstname').trim().isLength({min:3}).withMessage("firstname must be at least 3 char long"),
        body('email').trim().isEmail().withMessage("invalid email"),
        body('password').isLength({min:3}).withMessage("password must be at least 3 char long")
    ]
, handleUserRegister);

router.post("/login", 
    [body('email').trim().isEmail().withMessage("invalid email"),
    body('password').isLength({min:3}).withMessage("password must be at least 3 char long")]
, handleUserLogin);

router.use(authe);//all below routes should be only accessed if user is logged in.

router.post("/logout", handleUserLogout);

router.post("/delete", handleUserdelete);//delete user account and all post and comments associated with it

router.get("/profile", handleViewProfile);//view user profile

router.post("/profile",
    [body('username.firstname').trim().isLength({min:3}).withMessage("firstname must be at least 3 char long"),
    body('password').isLength({min:3}).withMessage("password must be at least 3 char long")]
, upload.single("file") ,handleEditProfile);//edit user profile 

module.exports = router;