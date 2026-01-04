const mongoose = require('mongoose');

const connectDB = async () => {
    // console.log(process.env.TO_ADDRESS+ process.env.FROM_ADDRESS+process.env.REGION)
    await mongoose.connect(process.env.DB_CONNECTION_SECRET)
}


module.exports = connectDB;

