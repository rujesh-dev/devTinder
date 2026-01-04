const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/User');
const {validateSignupData} = require('./utils/validation');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const {userAuth} = require('./middlewares/auth');
const {getJWT, validatePassword} = require('./models/User');
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const cors = require('cors');
require("dotenv").config();



const app = express();


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter)
app.use("/", userRouter)



connectDB()
.then(()=>{
    console.log('Database connected successfully');
    app.listen(process.env.PORT, ()=>{
    console.log('server is created successfully');
    
})
})

.catch((error)=>{
    console.error('Database connection failed');
})

 