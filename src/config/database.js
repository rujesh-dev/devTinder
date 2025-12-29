const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect('mongodb+srv://rujeshmahagavkar:rujesh@cluster0.kfv9o.mongodb.net/devTinder')
}


module.exports = connectDB;

