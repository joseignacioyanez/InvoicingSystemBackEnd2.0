// New Authorization for Backend
// Author: Jose Ignacio Yanez
// Based on: https://www.youtube.com/watch?v=f2EqECiTBL8

const Users = require("../models/Users")
const bcrypt = require('bcryptjs')

const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleLogin = async (req, res) => {
    const { username,passwordHash } = req.body;
    if (!username || !passwordHash) return res.status(400).json({"message": "Username and Password are required"});
    // Find user
    let userDB = await Users.findOne({"username":username}, (err, obj) => { }).clone();
    if (!userDB) return res.sendStatus(401); // Unathorized HHTP code

    // Evaluate Password
    const match = await bcrypt.compare(passwordHash, userDB.passwordHash);
    if(match){
        // Roles
        const roles = Object.values(userDB.roles)
        console.log(userDB.username, userDB.roles);
        // Here create JWT to use on protected API routes
        const accessToken = jwt.sign(
            {   
                "UserInfo": {
                    "username" : userDB.username,
                    "roles": roles
                } 
            },
            process.env.ACCESS_TOKEN_SECRET_T5,
            { expiresIn: '3m'}
        );
        const refreshToken = jwt.sign(
            { "username" : userDB.username },
            process.env.REFRESH_TOKEN_SECRET_T5,
            { expiresIn: '1d'}
        );
        const filter = {"username": username}
        const update = {"refreshToken": refreshToken}
        
        let currentUser = await Users.findOneAndUpdate(filter, update, {new:true} ).clone();

        // Send Tokens to User
        res.cookie('jwt', refreshToken, {httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000}) // Miliseconds $ httpOnly then Cookie is not accesible to User Safer than saving in Local Storage or other
        res.json({ roles, accessToken })
    }else{
        res.sendStatus(401);
    }
}

module.exports = { handleLogin }