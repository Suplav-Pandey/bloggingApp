const dotenv= require("dotenv");
dotenv.config();

const express=require("express");//requiring code of express in constant express
const connectDb = require("./config/db");
const userRoutes= require("./routes/user.routes");
const blogRoutes= require("./routes/blog.routes");
const commentRoutes=require("./routes/comment.routes");
const cookieParser = require("cookie-parser");
const port= process.env.PORT || 3000;

const app= express();//create a express server and store its refrence in app constant
connectDb();

//to parse form and json data
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());//to read cookies

app.get("/", (req,res)=>res.send("suplav"));//basic health route for checking in browser
app.use("/users" ,userRoutes);//user routes
app.use("/blogs", blogRoutes);//blog related routes
app.use("/comments", commentRoutes);//comment related routes


app.listen(port, (error)=>{
    if(error)console.log("server error", err);
    console.log("server started on port:", port)
});

//somethings left

//step1-> sorting and filter -> blogs and comments, other things that affect user experience

//step2-> role based access, jwt access+refresh tokens, like feature

//step3-> rate limmiting, caching(rdis), logging, dockerize, test it.

//final