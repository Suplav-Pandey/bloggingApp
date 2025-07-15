const User= require("../models/user.model"); //here all operations are on user
const Blog= require("../models/blog.models"); //here all operations are on blog
const Comments= require("../models/comment.models"); //here all operations are on user

const bcrypt= require("bcrypt");
const jwt=require("jsonwebtoken");
const cloudinary = require("../config/cloudinary");
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
        const token= jwt.sign({_id: user._id, name: username.firstname, profileImgUrl: null}, process.env.JWT_SECRET);
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
        
        const token= jwt.sign({_id: user._id, name: user.username.firstname, profileImgUrl: null}, process.env.JWT_SECRET);
        return res.status(200).cookie("token", token).json({"msg": "user logined successfully"});

    }catch(err){
        res.status(400).json({"error": err.message});
    }
}

function handleUserLogout(req, res){
    const user= req.user;
    if(!user)return res.status(401).json({"error": "you are not logged in"});
    // * blacklisting jwt token and then removing it from cookie and headers
    return res.status(200).clearCookie("token").json({"msg": "logged out successfully"});
}

async function handleUserdelete(req, res){
    try{
        const user=req.user;
        if(!user)return res.status(401).json({"error": "you are not logged in"});

        //user found so delete all information associated with it
        //deleting all comments done by this user
        await Comments.deleteMany({owner: user._id});

        //deleting all comments on the blogs created by user
        const blogs= await Blog.find({owner : user._id})
        await Promise.all(blogs.map(async (blog)=>{
            //deleting coverimage of every blog from cloudinary
            await cloudinary.uploader.destroy(`${blog.coverImg.id}`);//review it
            await Comments.deleteMany({blog: blog._id});//deleting comments
        }));

        //deleting all blogs
        await Blog.deleteMany({owner : user._id});

        const userToBeDeleted=await User.findOneAndDelete({_id: user._id});//deleting user
        if(!userToBeDeleted){//if no user found
            return res.status(400).json({"error": "no user found"});
        }        

        //deleting its porfile image from cloudinary
        const result =await cloudinary.uploader.destroy(`${userToBeDeleted?.profileImg.id}`);

        //blacklisting token in future-> result will only give response of user profile image
        return res.status(200).clearCookie('token').json({"msg": "user deleted successfully", "cloudinary": result?.result });
    }catch(err){
        res.status(500).json({"error": err.message});
    }
}

async function handleViewProfile(req, res){
    try{
        const user= req.user;
        if(!user)return res.status(401).json({"error": "you are not logged in"});

        const fullUser= await User.findOne({_id: user._id});
        if(!fullUser)return res.status(400).json({"error": "you are not logged in"});

        return res.status(200).json({
            user: fullUser
        });
    }catch(err){
        res.status(401).json({"error":err.message})
    }
}

async function handleEditProfile(req, res){
    try{
        const user= req.user;
        if(!user)return res.status(401).json({"error": "you are not logged in"});

        const errors=validationResult(req);
        if(!errors.isEmpty())return res.status(400).json({"error": errors.array()});

        if(!req.body)return res.status(400).json({"error":"you did not send anything to edit"});
        
        const updatedUser= req.body;//if user want to remove profile image it can click on removeProfileImg

        const password= updatedUser?.password;
        if(password)updatedUser.password= await bcrypt.hash(password, 10);//hashing password before storing it
        
        //profileimage
        const profileImg= (!req.file) ? undefined : {
            url:req.file.path,
            id: req.file.filename
        };
        //set new profileimage 
        if(profileImg)updatedUser.profileImg=profileImg;
        //remove profileimage
        else if(updatedUser.removeProfileImg)updatedUser.profileImg=null;

        //updating user
        const fullUser= await User.findOneAndUpdate({_id: user._id}, {
            username: updatedUser?.username, 
            password: updatedUser?.password, 
            email: updatedUser?.email,
            profileImg: updatedUser?.profileImg,//updating image
            role: updatedUser?.role
        },{runValidators: true, new: false});//to give old user before update

        //deleting old profile image from cloudinary when we recieve new one or a request of removing
        let result= undefined;
        if(req.file || updatedUser.removeProfileImg){
            result=await cloudinary.uploader.destroy(`${fullUser?.profileImg.id}`);
        }

        //new token shall be genetared to accomodate new user name and profile image url in it
        const token= jwt.sign({_id: user._id, name: fullUser.username.firstname, profileImg: profileImg?.url}, process.env.JWT_SECRET);
        res.status(200).cookie('token', token).json({"msg": "user updated", "cloudinary": result?.result});
    }catch(err){
        res.status(400).json({"error":err.message});
    }
}

module.exports={
    handleUserRegister, handleUserLogin, handleUserLogout, handleUserdelete, handleViewProfile, handleEditProfile
}