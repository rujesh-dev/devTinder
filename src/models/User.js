const mongoose = require('mongoose');
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 15

    },
     lastName: {
        type: String,
        minLength: 2,
        maxLength: 15
    },
     email: {
        type: String,
        lowercase: true,
        unique: true,
        // validate: {
        //     validator : function (v){
        //         const notAnEmail = v.includes('@gmail.com');
        //         if(!notAnEmail){
        //             throw new Error('Not An Email')
        //         }
        //     }
        // }

        validate(value){
            const isEmail = validator.isEmail(value)
            if(!isEmail){
                throw new Error('Enter a valid email'+value)
            }
        }
       
    },
     password: {
        type: String,
        required: true,
    //     validate: {
    //         validator : function (v){
    //             const has_capital = /[A-Z]/.test(v);
    //             const has_number = /\d/.test(v)
    //             const has_special_Char = /[a-zA-Z0-9]/.test(v)
    //             if(!has_capital || !has_number || !has_special_Char){
    //                 throw new Error('Password should contain atleast one special character, one capital letter, one small letter')
    //             }
    //         }
    // }
    //  validate(value){
    //         const isPasswordStrong = validator.isEmail(value)
    //         if(!isPasswordStrong){
    //             throw new Error('Password is not strong'+value)
    //         }
    //     }
},
    age: {
        type: String,
        default: "18+"
    },
    gender: {
        type: String,
        default: "male",
        enum:{
            values: ['male', 'female', 'other'],
            message: '{VALUE} not supported'
        }
    },
    skills: {
        type: [],
    },
    photoUrl:{
        type : String,
        default: 'https://www.shutterstock.com/image-vector/default-avatar-social-media-display-600nw-2632690107.jpg'

    },

    about: {
        type: String,
        default: "This is all about me."
    }
    
      
    
    
},
{ timestamps: true })

userSchema.methods.getJWT = async function() {
    const user = this;
    const token = await jwt.sign({_id: user._id}, "DEV@Tinder$790", {
        expiresIn: "1d",
    })
    return token;
}

userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user = this;
    const passwordStoredInDb = this.password;
    
    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordStoredInDb );
    return isPasswordValid;
}

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;