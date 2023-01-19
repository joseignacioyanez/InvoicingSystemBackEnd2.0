const { Decimal128 } = require('bson');
const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema({
    status:{
        required:true,
        type: String
    },
    code:{
        required:true,
        type: String
    },
    category:{
        required: true,
        type: String
    },
    name:{
        required: true,
        type: String
    },
    price:{
        required: true,
        type: Decimal128
    },
    paysTaxes:{
        required: true,
        type: Boolean
    }
})

// Third parameter used based on this website, this is the pure name of the Collection on Mongo
// https://stackoverflow.com/questions/14183611/mongoose-always-returning-an-empty-array-nodejs
module.exports = mongoose.model('MenuItem', menuItemSchema, 'menuItems')