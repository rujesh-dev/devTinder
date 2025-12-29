const User = require("../models/User");
const jwt = require("jsonwebtoken");


const userAuth = async(req, res, next) =>{
    try{
    const {token} = req.cookies;

    if(!token){
        // throw new Error("Token is invalid! ")
        return res.status(401).send("Token is not valid!!")
    }
    const decodeToken = await jwt.verify(token, "DEV@Tinder$790");
    const { _id } = decodeToken;
   
    
    
    const user = await User.findById({_id: _id});
    if(!user){
        throw new Error("User not found")
    }
    // console.log(user);
    req.user = user;
    next();
}catch(err){
    res.status(400).send("Error"+ err.message  );
}
}

module.exports = {
    userAuth,
}