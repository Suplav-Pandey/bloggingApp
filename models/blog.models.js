const mongoose=require("mongoose");

const blogSchema= new mongoose.Schema({
    title:{
        type: String,
        minLength: [3, 'title must be at least 3 character long'],
    },
    desc:{
        type:String,
        minLength: [5, 'description must be at least 5 char long']
    },
    coverImgUrl: {
        type: String,
        required: true,
    },
    body:{
        type:string,
        minLength: [30, 'body must be at least 50 char long']
    },
    owner:{
        type:mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    }
}, {timestamps: true});

const Blog= mongoose.model('blog', blogSchema);

module.exports= Blog;