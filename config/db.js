const mongoose=require("mongoose");

async function connectDb(){
    await mongoose.connect(process.env.MONGO_URI)
                  .then(()=>console.log("database connected"))
                  .catch((err)=>console.log("error", err));
}

module.exports=connectDb;