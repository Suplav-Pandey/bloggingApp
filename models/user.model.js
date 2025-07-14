const mongoose=require("mongoose");

const userSchema= mongoose.Schema({
    username:{
        firstname:{
            type:String,
            required: true,
            uppercase: true,
            minlength: [3, 'first name must be at least 3 char long']
        },
        lastname:String
    },
    email:{
        type: String,
        required: true,
        lowercase: true,
        unique: [true, 'this email already exist'],
    },
    password:{
        type:String,
        required: true,
        minlength: [3, 'password must be at least 3 char long'],
        select: false
    },
    profileImg:{
        url:String,
        id: String
    },    
    role:{
        type:String,
        enum: ["admin", "user"],
        default: "user"
    }
}, {timestamps: true});

const User= mongoose.model("user", userSchema);

module.exports= User;