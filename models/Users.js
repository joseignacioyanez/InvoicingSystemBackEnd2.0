const mongoose = require("mongoose");
const bcrypt = require ("bcryptjs");

const usersSchema = new mongoose.Schema({
    fullName:{
        required:true,
        type: String
    },
    email:{
        required: true,
        type: String
    },
    username:{
        required: true,
        type: String
    },
    passwordHash:{
        required: true,
        type: String
    },
    roles:{
        type: Object
    },
    refreshToken:{
        type: String
    }
})
// Function to Hash password before saving to DB
// Business Rule
usersSchema.pre('save',function(next){
    bcrypt.genSalt(10).then(salts=>{
        bcrypt.hash(this.passwordHash,salts).then(hash =>{
            this.passwordHash = hash;
            next();
        }).catch(error=>next (error));
    }).catch(error=>next (error));
})


// Third parameter used based on this website, this is the pure name of the Collection on Mongo
// https://stackoverflow.com/questions/14183611/mongoose-always-returning-an-empty-array-nodejs
module.exports = mongoose.model('Users', usersSchema, 'users')