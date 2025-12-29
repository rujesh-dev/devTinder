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
const cors = require('cors')


const app = express();




// app.use('/hello',(req, res)=>{
//     res.send('Hello......');
// })

// app.use('/hello/2',(req, res)=>{
//     res.send('Hello 2......');
// })




// app.use('/',(req, res)=>{
//     res.send('Hello devs......');
// })


// app.get(/ab+c/, (req, res)=>{
//     res.send({name:'Rujesh', age:25})
// })




// app.use('/user', [(req, res, next)=>{
//     next()
//     res.send('1st get request is called')
    
// },

// (req, res, next)=>{
//     next()
//     res.send('2nd get request is called')
// }],

// (req, res, next)=>{
//     res.send('3rd get request is called')
// },

// )


// app.delete('/user', (req, res)=>{
//     res.send('Deleted...')
// })


// app.use('/user', (req, res, next)=>{
//     const token = 'qwerty12345'
//     const isUserAuthenticated = token === 'qwerty12345';
//     console.log('Middleware is called...');
//     if(!isUserAuthenticated){
//         res.send('User is not authenticated');
//     }else{
//         next()
//     }

// })

// app.get('/user/data', (req, res)=>{
//     res.send('User data is here...');
// })




// app.use('/',(err, req, res, next)=>{
//     if(err){
//         res.status(500).send('Something broke!')
//     }
// })

// app.get('/getUserData',(req, res)=>{
//     throw new Error('BROKEN') // Express will catch this on its own.
// })



// app.use('/',(err, req, res, next)=>{
//     if(err){
//         res.status(500).send('Something broke!')
//     }
// })
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



app.get('/user', async (req, res)=>{

    const userEmail = req.body.email;
    // console.log(userEmail);
    
    try{
    const users = await User.find({email: userEmail});

    if(users === 0){
        res.status(404).send('No matched found')
    }else{
     res.send(users)
    }
    }catch (err){
        res.status(400).send('Something went wrong')
    }
   
    
    
})

app.get('/one', async(req, res)=>{
    const userEmail = req.body.email;

    try{
        const user = await User.findOne({email: userEmail})
        if(!user){
            res.status(404).send('Not found')
        }else{
            res.send(user)
        }
    }catch(err){
        res.status(400).send('something went wrong')
    }
})


app.get('/feed', async(req, res)=>{
    try{
        const users = await User.find({});
        if(users.length === 0){
            res.status(404).send('Data not found...')
        }else{
            res.send(users)
        }
    }catch(err){
        res.status(400).send('Something went wrong')
    }
})

app.get('/id', async(req, res)=>{
    const userId = req.body._id;
    try{
        const users = await User.findById({_id: userId});
        if(users.length ===0){
            res.status(404).send('No data found...')
        }else{
            res.send(users)
        }
    }catch(err){
        res.status(400).send('Something went wrong')
    }
})


app.delete('/user', async (req, res)=>{
    const userId = req.body._id;
    try{
       const users = await User.findByIdAndDelete({_id: userId});
       res.send(users)
    }catch(err){
        res.status(400).send('something went wrong')
    }
})

    
app.patch('/user', async(req, res)=>{
    const userId = req.body._id;
    const data = req.body;


    try{
        const ALLOWED_UPDATED = ['firstName', 'lastName', 'gender'];
        const isAllowed = Object.keys(data).every((k)=>{
            ALLOWED_UPDATED.includes(k);
        })

        if(!isAllowed){
            throw new Error('Not allowed to update')
        }
        const users = await User.findByIdAndUpdate({_id: userId}, data, {returnDocument:'before', runValidators: true});
        // console.log(users);
        
        res.send('data has been updated...')

    }catch(err){
        res.status(400).send('Something went wrong'+ err.message)
    }
})




connectDB()
.then(()=>{
    console.log('Database connected successfully');
    app.listen(3000, ()=>{
    console.log('server is created successfully');
    
})
})

.catch((error)=>{
    console.error('Database connection failed');
})

 