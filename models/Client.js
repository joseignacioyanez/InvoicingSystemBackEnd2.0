const mongoose = require("mongoose");

const ClientSchema = new mongoose.Schema({
    idCard:{
        required:true,
        type: String
    },
    name:{
        required:true,
        type: String
    },
    address:{
        required: true,
        type: String
    },
    cellphone:{
        required: true,
        type: String
    },
    email:{
        required: true,
        type: String
    }
})

// Third parameter used based on this website, this is the pure name of the Collection on Mongo
// https://stackoverflow.com/questions/14183611/mongoose-always-returning-an-empty-array-nodejs
module.exports = mongoose.model('Client', ClientSchema, 'clients')