const { request } = require("express");
const express = require("express");
const router = express.Router();
const Invoice = require("../models/Invoice")

module.exports = router;

// GET all the invoices
router.get("/invoices", async (req, res) => {
    try {
        const invoicesData = await Invoice.find();
        res.status(200).json(invoicesData);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

// GET invoice by invoiceNumber
router.get("/invoices/:invoiceNumber", async (req,res) => {
    try {
        const invoicesData = await Invoice.find({"invoiceNumber":req.params.invoiceNumber});
        res.status(200).json(invoicesData)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
})

// POST a new invoice
router.post("/invoices", async (req,res) => {
    let newInvoice = new Invoice({
        clientIDCard: req.body.clientIDCard,
        orderToGo: req.body.orderToGo,
        clientName: req.body.clientName,
        clientEmail: req.body.clientEmail,
        subtotalInvoice: req.body.subtotalInvoice,
        totalInvoice: req.body.totalInvoice,
        totalTaxesInvoice: req.body.totalTaxesInvoice,
        invoiceItems: req.body.invoiceItems,
        paymentMethod: req.body.paymentMethod,
        invoiceNumber: req.body.invoiceNumber,
        invoiceDate: req.body.invoiceDate,
        paymentState: req.body.paymentState
    })

    try {
        const invoiceToSave = await newInvoice.save();
        res.status(200).json({message: "Succesfully Created new Invoice", invoiceToSave})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

// PUT Update invoice parameters based on invoiceNumber
router.put("/invoice/:invoiceNumber", async (req, res) => {
    // Find out if that invoice code exists and save on variable
    let invoiceOld;
    try {
        await Invoice.findOne({"invoiceNumber":req.params.invoiceNumber}, (err, result) => {
            if(err){
                res.status(500).json({message: err.message});
            }
            else if(!result){
                res.status(404).json("There is no Invoice with that invoiceNumber");
            }
            else{
                invoiceOld = result;
            }
        }).clone(); 
        //Used this because if not Atlas does not like repeated queries 
        // https://stackoverflow.com/questions/68945315/mongooseerror-query-was-already-executed
    } catch (error) {
        res.status(500).json({message: error.message});
    }

    let newInvoice = {};
    
    // Update local variable with parameters that have been sent, no Upsert
    let requestParameters = Object.keys(req.body);
    if (requestParameters.includes("clientIDCard")) newInvoice.clientIDCard = req.body.clientIDCard;
    if (requestParameters.includes("orderToGo")) newInvoice.orderToGo = req.body.orderToGo;
    if (requestParameters.includes("clientName")) newInvoice.clientName = req.body.clientName;
    if (requestParameters.includes("clientEmail")) newInvoice.clientEmail = req.body.clientEmail;
    if (requestParameters.includes("subtotalInvoice")) newInvoice.subtotalInvoice = req.body.subtotalInvoice;
    if (requestParameters.includes("totalTaxesInvoice")) newInvoice.totalTaxesInvoice = req.body.totalTaxesInvoice;
    if (requestParameters.includes("totalInvoice")) newInvoice.totalInvoice = req.body.totalInvoice;
    if (requestParameters.includes("invoiceItems")) newInvoice.invoiceItems = req.body.invoiceItems;
    if (requestParameters.includes("paymentMethod")) newInvoice.paymentMethod = req.body.paymentMethod;
    if (requestParameters.includes("invoiceNumber")) newInvoice.invoiceNumber = req.body.invoiceNumber;
    if (requestParameters.includes("invoiceDate")) newInvoice.invoiceDate = req.body.invoiceDate;
    if (requestParameters.includes("paymentState")) newInvoice.paymentState = req.body.paymentState;

    // Do the Updating
    try {
        const filter = { invoiceNumber: req.params.invoiceNumber };
        const update = newInvoice;

        let updatedInvoice = await Invoice.findOneAndUpdate(filter, update, {
            new: true,
            upsert: false
        });

        res.status(200).json({ message:"Success at Updating  of Invoice",
                                newItem: updatedInvoice })

    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

// DELETE Invoice by invoiceNumber
router.delete("/invoice/:invoiceNumber", async (req, res) => {
    try {
        await Invoice.deleteOne({invoiceNumber: req.params.invoiceNumber}, function (err) {
            if (err) res.status(500).json({message: "Error at deleting invoice"});
        }).clone();
        res.status(200).json({message:`If there was an invoiceNumber ${req.params.invoiceNumber}, it has been deleted :(`})

    } catch (error) {
        res.status(500).json({message:error.message});
    }
})

// GET EMAIL     all the invoices
router.get("/invoices", async (req, res) => {
    
    var nodemailer = require('nodemailer');

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'youremail@gmail.com',
        pass: 'yourpassword'
      }
    });
    
    var mailOptions = {
      from: 'youremail@gmail.com',
      to: 'myfriend@yahoo.com',
      subject: 'Sending Email using Node.js',
      text: 'That was easy!'
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
 
    
})