const express = require('express');
const authRouter = express.Router();
const User = require ("../models/User");
const {getJWT, validatePassword} = require("../utils/validation");
const {validateSignupData} = require("../utils/validation");
const bcrypt = require("bcrypt")

authRouter.post('/signup', async(req, res)=>{
    // const user = new User({
    //     firstName: 'Akshay',
    //     lastName: 'Saini',
    //     email: 'akshay@gmail.com',
    //     password: 'akshay@123'

    // });

    // console.log(req.body);
    try{
    
    validateSignupData(req);

    const {firstName, lastName, email, password} = req.body;
    const hashPassword = await bcrypt.hash(password, 10)
    const user = new User({
        firstName,
        lastName,
        email,
        password: hashPassword
    });
    

           const isPasswordValid = await user.validatePassword(password);
        // const token = await jwt.sign({_id: user._id}, "DEV@Tinder$790", {
        //         expiresIn: "1d"
        //     })
        const token = await user.getJWT();
        
        if(isPasswordValid){
            res.cookie("token", token)
            res.send(user);
        }else{
            throw new Error('Invalid credentials')
        }
        // throw new Error('ajsahd')
         await user.save();
         res.send('Data has been saved successfully')
    }catch (err){
        res.status(400).send('Error ouccurred while saving data' + err.message)
    }
   

})


authRouter.post('/login', async(req, res)=>{
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email: email});
        // console.log(user);   
        
        if(!user){
            throw new Error("Invalid credentials")
        }

        // const isPasswordValid = await bcrypt.compare(password, user.password);
        const isPasswordValid = await user.validatePassword(password);
        // const token = await jwt.sign({_id: user._id}, "DEV@Tinder$790", {
        //         expiresIn: "1d"
        //     })
        const token = await user.getJWT();
        
        if(isPasswordValid){
            res.cookie("token", token)
            res.send(user);
        }else{
            throw new Error('Invalid credentials')
        }
        

    }catch(err){
        res.status(400).send('Error occurred '+err.message)
    }
})


authRouter.post("/logout", (req, res)=>{
    res.cookie("token", null, {
        expires: new Date(Date.now()),
    })
    res.send("You have been logout successfully!")

})



module.exports = authRouter;
