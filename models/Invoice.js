const { Decimal128 } = require('bson');
const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
    clientIDCard:{
        required:true,
        type: String
    },
    orderToGo:{
        required:true,
        type: Boolean
    },
    clientName:{
        required: true,
        type: String
    },
    clientEmail:{
        required: true,
        type: String
    },
    subtotalInvoice:{
        required: true,
        type: Decimal128
    },
    totalTaxesInvoice:{
        required: true,
        type: Decimal128
    },
    totalInvoice:{
        required: true,
        type: Decimal128
    },
    invoiceItems:{
        required: true,
        type: Array
    },
    paymentMethod:{
        required: true,
        type: String
    },
    invoiceNumber:{
        required: true,
        type: Number
    },
    invoiceDate:{
        required: true,
        type: String
    },
    paymentState:{
        required: true,
        type: String
    }
})

// Third parameter used based on this website, this is the pure name of the Collection on Mongo
// https://stackoverflow.com/questions/14183611/mongoose-always-returning-an-empty-array-nodejs
module.exports = mongoose.model('Invoice', invoiceSchema, 'invoices')