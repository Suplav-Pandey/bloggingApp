const Blog= require("../models/blog.models");
const Comment= require("../models/comment.models");
const cloudinary = require("../config/cloudinary");
const {validationResult}= require("express-validator");

async function handleAllBlogsListing(req,res){//to list all blogs
    try{
        const blogs= await Blog.find().select("-body");//will list all blogs but do not bring there body
        if(blogs.length===0)return res.status(200).json({"msg":"no Blog created yet, be the first one"});
        return res.status(200).json({"blogs":blogs});
    }
    catch(err){
        return res.status(500).json({"error":err.message});
    }
}

async function handleBlogView(req,res){//showing the blog with _id === id (from params)
    try{
        const id=req.params.id;
        const blog= await Blog.findOne({_id : id});
        if(!blog){
            return res.status(404).json({"error": "requested blog is not present"});
        }
        return res.status(200).json({"blog": blog});
    }
    catch(err){
        return res.status(500).json({"error": err.message});
    }
}

async function handleUserBlogsListing(req,res){//to list all blogs
    try{
        const user= req.user;
        if(!user){
            return res.status(401).json({"error": "login to view your blogs"});
        }
        const blogs= await Blog.find({owner: user._id}).select("-body");//will list all blogs of current user but do not bring there body
        if(blogs.length===0)return res.status(200).json({"msg":"you do not have any blog yet, create one"});
        return res.status(200).json({"blogs":blogs});
    }
    catch(err){
        return res.status(500).json({"error":err.message});
    }
}

async function handleBlogCreation(req, res){
    try{
        const user= req.user;
        if(!user){
            return res.status(401).json({"error": "login to create a blog"});
        }

        const errors= validationResult(req);//errors if validation failed
        if(!errors.isEmpty()){
            return res.status(400).json({"error": errors.array()});
        } 

        //taking a coverimage of blog
        if(!req.file){
            return res.status(400).json({"error": "converImg is not uploaded"});
        }
        const coverImg=  {
            url:req.file.path,
            id: req.file.filename
        };

        const {title, desc, body}=req.body;

        const blog= await Blog.create({
            title,
            desc,
            coverImg,
            body,
            owner: user._id
        });
        return res.status(201).json({"msg": "blog created successfully", "blog": blog });
    }
    catch(err){
        return res.status(400).json({"error": err.message});
    }
}

async function handleBlogEdit(req,res){
    try{
        const user= req.user;
        if(!user){
            return res.status(401).json({"error": "login to edit this blog"});
        }
        //take actual image file through multer-> upload it in any fileStorage -> then take its actual url.
        const id=req.params.id;

        const errors= validationResult(req);//errors if validation failed
        if(!errors.isEmpty()){
            return res.status(400).json({"error": errors.array()});
        }

        if(!req.body)return res.status(400).json({"error": "you did not send anything to edit"});

        //taking coverimage of blog
        req.body.coverImg= (!req.file) ? undefined : {
            url:req.file.path,
            id: req.file.filename
        };

        const blog= await Blog.findOneAndUpdate({ _id: id, owner: user._id },{
            title: req.body?.title,
            desc: req.body?.desc,
            coverImg: req.body?.coverImg,
            body: req.body?.body
        });//we will find a blog with given id and and owner as current user and then will update it

        if(!blog){
            return res.status(403).json({"error": "current logined user is not owner or blog not found"});
        }
        //new image uploaded so deleting old coverimage
        let result=undefined;
        if(req.file)result = await cloudinary.uploader.destroy(`${blog.coverImg.id}`);

        return res.status(200).json({"msg": "blog updated successfully", "cloudinary": result?.result});
    }
    catch(err){
        return res.status(400).json({"error": err.message});
    }
}

async function handleBlogDelete(req,res){
    try{
        const user= req.user;
        if(!user){
            return res.status(401).json({"error": "login to delete this blog"});
        }

        const id=req.params.id;
        
        await Comment.deleteMany({blog: id});//deleting all comments associated with this blog

        const blog= await Blog.findOneAndDelete({ _id: id, owner: user._id });//we will find a blog with given id and and owner as current user and then will delete it

        if(!blog){
            return res.status(403).json({"error": "current logined user is not owner of blog or blog not found"});
        }
        //deleting coverimage of the blog
        const result = await cloudinary.uploader.destroy(`${blog.coverImg.id}`);

        return res.status(200).json({"msg": "blog deleted successfully", "cloudinary": result?.result});
    }
    catch(err){
        return res.status(400).json({"error": err.message});
    }
}

module.exports= {
    handleAllBlogsListing, handleBlogView, handleUserBlogsListing, handleBlogCreation, handleBlogEdit, handleBlogDelete
}