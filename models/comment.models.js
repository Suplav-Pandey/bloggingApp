const mongoose=require("mongoose");

const commentSchema= new mongoose.Schema({
    body:{
        type:String,
        minLength: [2, "comment should be at least 2 char long"]
    },
    blog:{
        type: mongoose.Types.ObjectId,
        ref: 'blog',
        required: true
    },
    owner:{
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    }
}, {timestamps: true});

const Comment= mongoose.model('comment', commentSchema);

module.exports= Comment;