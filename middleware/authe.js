const jwt= require("jsonwebtoken");

function authe(req,res,next){
    try{
        const token= req.cookies?.token || req.headers?.Authorization?.split(' ')[1];
        if(!token){
            return res.status(401).json({"error": "login to access this resource"});
        }

        const user= jwt.verify(token, process.env.JWT_SECRET);
        if(!user){
            return res.status(401).json({"error": "Invalid token, please login again"});
        }
        req.user=user;//req.user is fixed only if token if present and user is valid else we move to next
        next();
    }
    catch(err){
        return res.status(401).json({"error": "login to access this resource"});//token is being tempered
    }
}

module.exports=authe;