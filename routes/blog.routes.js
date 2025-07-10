const {Router}= require("express");
const authe = require("../middleware/authe");
const router=Router();

//we can: create, edit, delete, view-> coonsider it tommarow
router.get("/view/:id", );

authe(); //below all functionalities are only accessable to logined user

router.post("/create", );
router.post("/edit", );
router.post("/delete", );

module.exports= router;