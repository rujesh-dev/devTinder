const express = require('express');
const {userAuth} = require("../middlewares/auth");
const bcrypt = require("bcrypt")

const profileRouter = express.Router();


profileRouter.get("/profile/user", userAuth, async(req, res, next)=>{
    try{  
        const user = req.user; 
        res.send(user)
        // console.log(user);
        
    }catch(err){
        res.send("No data found")
    }
})


profileRouter.patch("/profile/edit", userAuth, async (req, res)=>{
    try{
        const AllowedEditFields = ["firstName", "lastName", "photoUrl", "age", "gender", "skills"];

        const isAllowedToEdit = Object.keys(req.body).every((field) => AllowedEditFields.includes(field));
        if(!isAllowedToEdit){
            throw new Error("Invalid Submission!")
        }
        const loginUserData = req.user;
        
        Object.keys(req.body).forEach((key) => (loginUserData[key]= req.body[key]));
        
        await loginUserData.save();
        
        
        res.json({
            message:   `${loginUserData.firstName} Your profile updated successfully`,
            data: loginUserData
        });

    }catch(err){
        res.status(400).send("Error!"+err.message)
    }
})



profileRouter.patch("/profile/password", userAuth, async(req, res)=>{
    try{
        const oldPasswordByUser = req.body.password;
        const loginUserData = req.user;
        const newPassword = req.body.newPassword;
        const isPasswordMatching = await bcrypt.compare(oldPasswordByUser, loginUserData.password);
        if(!isPasswordMatching){
            throw new Error('Password not matching!')
        }
        loginUserData.password = await bcrypt.hash(newPassword, 10);
        await loginUserData.save();
        res.send('updated successfully')
    }catch(err){
        res.status(400).send("Error "+err.message)
    }
})


module.exports = profileRouter;