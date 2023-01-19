const { request } = require("express");
const express = require("express");
const router = express.Router();
const Users = require("../models/Users")


module.exports = router;

// GET all the users
router.get("/users", async (req, res) => {    
    try {
        const usersData = await Users.find();
        res.status(200).json(usersData);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

// GET users by username
router.get("/users/:username", async (req,res) => {
    try {
        const usersData = await Users.find({"username":req.params.username});
        res.status(200).json(usersData)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
})

// POST a new users
// Business Rule - Encryption with save().pre on Mongo
router.post("/users", async (req,res) => {
    let newUsers = new Users({
        idCard: req.body.idCard,
        fullName: req.body.fullName,
        email: req.body.email,
        username: req.body.username,
        passwordHash: req.body.passwordHash,
        type: req.body.type
    })

    const user = await Users.findOne({"username": req.body.username});
    if(user){
        console.log("It exists");
    }else{
        console.log("It is new");
    }

    if(!user){
        try {
            const usersToSave = await newUsers.save();
            res.status(200).json({message: "Succesfully Created new Users", usersToSave})
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    }else{
        res.status(409).json({"error": "Username Already existed"})
    }
})

// PUT Update users parameters based on username
router.put("/users/:username", async (req, res) => {
    // Find out if that users username exists and save on variable
    let usersOld;
    try {
        await Users.findOne({"username":req.params.username}, (err, result) => {
            if(err){
                res.status(500).json({message: err.message});
            }
            else if(!result){
                res.status(404).json({message:"There is no Users with that username"});
            }
            else{
                usersOld = result;
            }
        }).clone(); 
        //Used this because if not Atlas does not like repeated queries 
        // https://stackoverflow.com/questions/68945315/mongooseerror-query-was-already-executed
    } catch (error) {
        res.status(500).json({message: error.message});
    }

    let newUsers = {};
    
    // Update local variable with parameters that have been sent, no Upsert
    let requestParameters = Object.keys(req.body);
    if (requestParameters.includes("fullName")) newUsers.fullName = req.body.fullName;
    if (requestParameters.includes("email")) newUsers.email = req.body.email;
    if (requestParameters.includes("username")) newUsers.username = req.body.username;
    if (requestParameters.includes("type")) newUsers.type = req.body.type;

    // Do the Updating
    try {
        const filter = { username: req.params.username   };
        const update = newUsers;

        let updatedUsers = await Users.findOneAndUpdate(filter, update, {
            new: true,
            upsert: false
        });

        res.status(200).json({ message:"Success at Updating User",
                                newUsers: updatedUsers })

    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

// DELETE users by username
router.delete("/users/:username", async (req, res) => {
    try {
        await Users.deleteOne({username: req.params.username}, function (err) {
            if (err) res.status(500).json({message: "Error at deleting users"});
        }).clone();
        res.status(200).json({message:`If there was a users with username ${req.params.username}, it has been deleted :(`})

    } catch (error) {
        res.status(500).json({message:error.message});
    }
})