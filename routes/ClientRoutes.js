const express = require("express");
const router = express.Router();
const Client = require("../models/Client") 
const Invoice = require("../models/Invoice") // For business Rule
const verifyJWT = require('../middleware/verifyJWT') // For autenthication

module.exports = router;

// GET all the Clients
router.get( "/clients", verifyJWT, async (req, res) => {
    try {
        const clientsData = await Client.find();
        res.status(200).json(clientsData);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

// GET client by idCard
router.get("/clients/:idCard", async (req,res) => {
    try {
        const clientsData = await Client.find({"idCard":req.params.idCard});
        res.status(200).json(clientsData)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
})

// POST a new client
router.post("/clients", async (req,res) => {
    let newClient = new Client({
        idCard: req.body.idCard,
        name: req.body.name,
        email: req.body.email,
        address: req.body.address,
        cellphone: req.body.cellphone
    })

    try {
        const clientToSave = await newClient.save();
        res.status(200).json({message: "Succesfully Created new Client", clientToSave})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

// PUT Update client parameters based on idCard
router.put("/client/:idCard", async (req, res) => {
    // Find out if that Client idCard exists and save on variable
    let clientOld;
    try {
        await Client.findOne({"idCard":req.params.idCard}, (err, result) => {
            if(err){
                res.status(500).json({message: err.message});
            }
            else if(!result){
                res.status(404).json("There is no Client with that idCard");
            }
            else{
                clientOld = result;
            }
        }).clone(); 
        //Used this because if not Atlas does not like repeated queries 
        // https://stackoverflow.com/questions/68945315/mongooseerror-query-was-already-executed
    } catch (error) {
        res.status(500).json({message: error.message});
    }

    let newClient = {};
    
    // Update local variable with parameters that have been sent, no Upsert
    let requestParameters = Object.keys(req.body);
    if (requestParameters.includes("idCard")) newClient.idCard = req.body.idCard;
    if (requestParameters.includes("name")) newClient.name = req.body.name;
    if (requestParameters.includes("email")) newClient.email = req.body.email;
    if (requestParameters.includes("address")) newClient.address = req.body.address;
    if (requestParameters.includes("cellphone")) newClient.cellphone = req.body.cellphone;

    // Do the Updating
    try {
        const filter = { idCard: req.params.idCard };
        const update = newClient;

        let updatedClient = await Client.findOneAndUpdate(filter, update, {
            new: true,
            upsert: false
        });

        res.status(200).json({ message:"Success at Updating Client",
                                newItem: updatedClient })

    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

// DELETE Client by idCard
router.delete("/client/:idCard", async (req, res) => {
    try {
        await Client.deleteOne({idCard: req.params.idCard}, function (err) {
            if (err) res.status(500).json({message: "Error at deleting Client"});
        }).clone();
        res.status(200).json({message:`If there was a Client with idCard ${req.params.idCard}, it has been deleted :(`})

    } catch (error) {
        res.status(500).json({message:error.message});
    }
})

// Business Rule
// GET a Report of a Client
// With the total amount he has spend on the Restaurant and how many times he has purchased
router.get("/client/:idCard/report", async (req, res) => {
    try {
        let totalSpent = 0.0;
        let timesPurchased = 0;
        let invoicesOfClientData = await Invoice.find({idCard: req.params.idCard});

        const idCardClient = req.params.idCard;

        invoicesOfClientData.forEach((invoice, i) => {
            if (String(idCardClient) == (invoice.clientIDCard)) {
                totalSpent += Number(invoice.totalInvoice);
                timesPurchased ++;
            }
        })

        res.status(200).json({message:`The Client with idCard ${idCardClient} has spent \$${totalSpent} on ${timesPurchased} purchases on the Restaurant.`})

    } catch (error) {
        res.status(500).json({message:error.message});
    }
})