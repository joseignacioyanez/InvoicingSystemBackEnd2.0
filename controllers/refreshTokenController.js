// New Authorization for Backend
// Author: Jose Ignacio Yanez
// Based on: https://www.youtube.com/watch?v=f2EqECiTBL8
const Users = require("../models/Users")

const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;
    // Find user
    let userDB = await Users.findOne({"refreshToken":refreshToken});
    if (!userDB) return res.sendStatus(403); //Forbidden 
    // evaluate jwt
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET_T5,
        (err, decoded) => {
            if (err || userDB.username !== decoded.username) return res.sendStatus(403);
            const roles = Object.values(userDB.roles);
            const accessToken = jwt.sign(
                { 
                    "UserInfo": {
                    "username": decoded.username,
                    "roles": roles
                    }
                },     
                process.env.ACCESS_TOKEN_SECRET_T5,
                { expiresIn: '3m' }
            );
            res.json({ accessToken })
        }
    );
}

module.exports = { handleRefreshToken }