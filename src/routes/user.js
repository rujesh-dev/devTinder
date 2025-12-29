const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/ConnectionRequest');
const User = require('../models/User')

const userRouter = express.Router();

userRouter.get("/user/requests/received", userAuth,  async(req, res)=>{
    try{
        const loggenInUser = req.user;
        const receivedRequests = await ConnectionRequest.find({
            toUserId: loggenInUser._id,
            status: "interested"
        }).populate("fromUserId", "")
        res.send(receivedRequests);
    }catch(err){
        res.status(400).send("Error!"+ err.message)
    }
})


userRouter.get("/user/connections", userAuth, async (req, res)=>{
    try{
        const loggenInUser = req.user;
        const connections = await ConnectionRequest.find({
            $or: [
                { status: "accepted",toUserId: loggenInUser._id},
                { status: "accepted",fromUserId: loggenInUser._id}
            ]
        })
        .populate("fromUserId", "")
        .populate("toUserId", "")


        const data = connections.map(row => {
            if(row.fromUserId.equals(loggenInUser._id)){
                return row.toUserId;
            }
            return row.fromUserId
        }
        )
        // console.log("Connections"+connections);
        // console.log("Connections"+data);
        
        res.json({data: data})
    }catch(err){
        res.send("Error!"+err.message)
    }
})


userRouter.get("/user/feed", userAuth, async (req, res)=>{
    try{
        const loggenInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        // const page = 1;
        let limit = parseInt(req.query.limit) || 10;
        // const limit = 10
        limit = limit > 50 ? 50 : limit;
        const skip = (page-1) * limit;

       const ConnectionRequestData = await ConnectionRequest.find({
        $or: [
            {fromUserId: loggenInUser._id},
            {toUserId: loggenInUser._id}
        ]
       }).select("fromUserId toUserId")

       const hideUsersFromFeed = new Set();
       ConnectionRequestData.forEach((req) => {
        hideUsersFromFeed.add(req.fromUserId.toString());
        hideUsersFromFeed.add(req.toUserId.toString());
       })

       const user = await User.find({
        $and: [
            {_id: {$nin: Array.from(hideUsersFromFeed)}},
            {_id: {$ne: loggenInUser._id}}

        ]
    //    }).select("_id firstName lastName photoUrl age gender")
        }).select()
       .skip(skip)
       .limit(limit)

        res.send(user)
    }catch(err){
        res.status(400).send("Error!"+err.message)
    }
})



module.exports = userRouter;