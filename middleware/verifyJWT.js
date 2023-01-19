// New Authorization for Backend
// Author: Jose Ignacio Yanez
// Based on: https://www.youtube.com/watch?v=f2EqECiTBL8

const jwt = require("jsonwebtoken");
require('dotenv').config();

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    console.log(authHeader);
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET_T5,
        (err, decoded) => {
            if (err) return res.sendStatus(403); // Forbidden, may have been tampered , invalid
            req.user = decoded.UserInfo.username;
            req.roles = decoded.UserInfo.roles;
            next();
        }
    );
}

module.exports = verifyJWT