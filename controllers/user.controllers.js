const User= require("../models/user.model"); //here all operations are on user
const bcrypt= require("bcrypt");
const jwt=require("jsonwebtoken");
const {validationResult}= require("express-validator");

async function handleUserRegister(req, res){
    const errors= validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({"error": errors.array()});
    }

    const {username, email, password} = req.body;
    const hashPassword = await bcrypt.hash(password, 10);//hashing password

    try{
        const user= await User.create({
            username,
            email,
            password: hashPassword
        });
        const token= jwt.sign({_id: user._id, name: username.firstname}, process.env.JWT_SECRET);
        return res.status(201).cookie("token", token).json({"msg": "user registered successfully"});

    }
    catch(err){
        res.status(400).json({"error": err.message});
    }
}

async function handleUserLogin(req, res){
    const errors= validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({"error": errors.array()});
    }

    const {email, password} = req.body;

    try{
        const user= await User.findOne({ email }).select('+password');//explecitly telling it to bring password

        if(!user)return res.status(400).json({"error": "email or password is incorrect"});

        const result=await bcrypt.compare(password, user.password);//hashing password
        //if promise resolved=> password accepted else catch ->rejected
        if(!result)return res.status(400).json({"error": "email or password is incorrect"});

        const token= jwt.sign({_id: user._id, name: user.username.firstname}, process.env.JWT_SECRET);
        return res.status(200).cookie("token", token).json({"msg": "user logined successfully"});

    }catch(err){
        res.status(400).json({"error": err.message});
    }
}

function handleUserLogout(req, res){
    const token= req.cookies?.token;
    if(!token)return res.status(400).json({"error": "you are not logged in"});
    // * blacklisting jwt token and then removing it from cookie and headers
    return res.status(200).clearCookie("token").json({"msg": "logged out successfully"});
}

async function handleUserdelete(req, res){
    try{
        const token= req.cookies?.token;
        const user= jwt.verify(token, process.env.JWT_SECRET);
        // * deleting all comments and blog posts created by this user and comments associated with those blogs
        const userToBeDeleted=await User.findOneAndDelete({_id: user._id});
        if(!userToBeDeleted){
            return res.status(400).json({"error": "no user found"});
        }
        return res.status(200).json({"msg": "user deleted successfully"});

    }catch(err){
        res.status(500).json({"error": err.message});
    }
}

async function handleViewProfile(req, res){
    try{
        const token= req.cookies?.token;
        const user= jwt.verify(token, process.env.JWT_SECRET);
        const fullUser= await User.findOne({_id: user._id});
        res.status(200).json({
            firstname: fullUser.username.firstname,
            lastname: fullUser.username?.lastname,
            email: fullUser.email,
            profileImgUrl: fullUser.profileImgUrl,// * send whole image not just url using firebase file storage 
            role: fullUser.role
        });
    }catch(err){
        res.status(401).json({"error":err.message})
    }
}

async function handleEditProfile(req, res){
    try{
        const token= req.cookies?.token;
        const user= jwt.verify(token, process.env.JWT_SECRET);
        const updatedUser= req.body;

        const password= updatedUser?.password;
        if(password)updatedUser.password= await bcrypt.hash(password, 10);//hashing password before storing it

        const fullUser= await User.findOneAndUpdate({_id: user._id}, {
            username: updatedUser?.username, 
            password: updatedUser?.password, 
            profileImgUrl: updatedUser?.profileImgUrl,// * restore whole image in firebase and deleting prev one
            role: updatedUser?.role
        },{runValidators: true});
        res.status(200).json({"msg": "user updated"});
    }catch(err){
        res.status(400).json({"error":err.message});
    }
}

module.exports={
    handleUserRegister, handleUserLogin, handleUserLogout, handleUserdelete, handleViewProfile, handleEditProfile
}