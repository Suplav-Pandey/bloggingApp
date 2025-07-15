const Comment= require("../models/comment.models");
const Blog=require("../models/blog.models");
const {validationResult}= require("express-validator");

async function handleListBlogComments(req, res){
    try{
        const blogId= req.params.blogId;
        const comments= await Comment.find({blog: blogId}).populate("owner", "username profileImgUrl");
        if(comments.length===0){
            return res.status(200).json({"msg": "no comment on the blog, be the first one"});
        }
        return res.status(200).json({"comments": comments});
    }
    catch(err){
        return res.status(400).json({"error": err.message});
    }
}

async function handleListUserComments(req,res){
    try{
        const user=req.user;
        const userId=user._id;
        const comments= await Comment.find({ owner : userId});

        if(comments.length===0){
            return res.status(200).json({"msg": "you did not have any comment yet"});
        }
        return res.status(200).json({"comments": comments});
    }
    catch(err){
        return res.status(400).json({"error": err.message});
    }
}

async function handleCreateComment(req, res){
    try{
        const user=req.user;
        if(!user){
            return res.status(401).json({"error":"you must login to create comment"});
        }

        const userId=user._id;
        const blogId= req.params.blogId;
        const blog= await Blog.findOne({_id : blogId});
        if(!blog)return res.status(400).json({"error": "there is not blog to comment on"});

        const errors= validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({"error": errors.array()});
        }

        const comment= await Comment.create({
            body: req.body.body,
            blog: blogId,
            owner: userId
        });

        return res.status(201).json({"msg": "comment created successfully"});
    }
    catch(err){
        return res.status(400).json({"error": err.message});
    }
}

async function handleEditComment(req,res){
    try{
        const user=req.user;
        if(!user){
            return res.status(401).json({"error":"you must login to edit comment"});
        }

        const errors= validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({"error": errors.array()});
        }

        const userId=user._id;
        const commentId= req.params.id;

        if(!req.body)return res.status(400).json({"error": "you did not send anything to edit"});

        const comment= await Comment.findOneAndUpdate({ owner: userId, _id: commentId },{
            body: req.body.body
        });

        if(!comment){
            return res.status(400).json({"error": "you are not owner of this comment"});
        }

        return res.status(200).json({"msg": "comment edited successfully"});
    }
    catch(err){
        return res.status(400).json({"error": err.message});
    }
}

async function handleDeleteComment(req, res){
    try{
        const user=req.user;
        if(!user){
            return res.status(401).json({"error":"you must login to delete comment"});
        }
        const userId=user._id;
        const commentId= req.params.id;

        const comment= await Comment.findOneAndDelete({ owner: userId, _id: commentId });

        if(!comment){
            return res.status(400).json({"error": "you are not owner of this comment"});
        }

        return res.status(200).json({"msg": "comment deleted successfully"});
    }
    catch(err){
        return res.status(400).json({"error": err.message});
    }
}

module.exports={
    handleListBlogComments, handleListUserComments, handleCreateComment, handleEditComment, handleDeleteComment
}