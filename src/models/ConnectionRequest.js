const mongoose = require('mongoose');

const ConnectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: "User"
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: "User"

    },
    status:{
        type: String,
        enum : {
            values: ["interested", "reject", "accepted", "rejected", "ignored"]
        }
    },
   
},
{
    timestamps: true
}
)


ConnectionRequestSchema.index({fromUserId:1, toUserId:1});


ConnectionRequestSchema.pre("save",  async function () {
const ConnectionRequest = this;
if(ConnectionRequest.fromUserId.equals(ConnectionRequest.toUserId)){
    throw new Error("Cannot send request to yourelf!")
}
// next()
})

const ConnectionRequestModel = mongoose.model("ConnectionRequest", ConnectionRequestSchema);



module.exports = ConnectionRequestModel;
