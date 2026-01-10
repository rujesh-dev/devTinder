const express = require('express');
const {userAuth} = require("../middlewares/auth");
const ConnectionRequest = require("../models/ConnectionRequest");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail_temp")


const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:userId", userAuth, async (req, res, next)=>{
    try{
        const toUserId = req.params.userId;
        const fromUserId = req.user._id;
        const status =  req.params.status;

        const requestData = new ConnectionRequest({
            toUserId,
            fromUserId,
            status
        })

        const allowedStatus = ['interested', 'ignored'];
        if(!allowedStatus.includes(status)){
            res.status(400).send("Invalid status!") 
        }
        
        const InvalidRequest = await ConnectionRequest.findOne({
            $or: [  
                {toUserId, fromUserId},
                {toUserId: fromUserId, fromUserId: toUserId},
            ]
            
        })

        const toUserIdCheck  = await User.findOne({_id: toUserId});
        if(!toUserIdCheck){
            return res.status(400).send({message: "No such user found!"})
        }

        if(InvalidRequest){
            return res.status(400).send({message: "Invalid request!"})
        }
        const  data = await requestData.save();
        const resEmail = await sendEmail.run("You have got the friend request", "Please login to devTinder!");
        console.log(resEmail);
        
        res.send(data);

    }catch(err){
        res.status(400).send("Error! "+err.message);
        console.error(err.message)
    }
})



requestRouter.post("/request/review/:status/:requestId", userAuth, async(req, res)=>{
    try{
        const loggenInUser = req.user;
        const {status, requestId} = req.params;
        

        const allowedStatus = ["accepted", "rejected"];

        if(!allowedStatus.includes(status)){
            return res.status(400).send("Invalid status!");
        }

        const requestData = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggenInUser._id,
            status: "interested"
        })

        if(!requestData){
            return res.status(400).send("No request found!");
        }

        requestData.status = status;
        

        await requestData.save();
        res.send("You have accepeted the request!")

    }catch(err){
        res.status(400).send("Error!"+err.message)
    }
})

module.exports = requestRouter;