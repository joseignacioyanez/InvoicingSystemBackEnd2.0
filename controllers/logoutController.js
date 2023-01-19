// New Authorization for Backend
// Author: Jose Ignacio Yanez
// Based on: https://www.youtube.com/watch?v=f2EqECiTBL8
const Users = require("../models/Users")

const handleLogout = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); //Succesfull but no content
    const refreshToken = cookies.jwt;
    // Is Refreshed token in DB?
    let userDB = await Users.findOne({"refreshToken":refreshToken});
    if (!userDB) {
        res.clearCookie('jwt', { httpOnly: true,  sameSite: 'None', secure: true });
        return res.sendStatus(204); //Succesful no content 
    }
    // Delete Refreshtoken of DB
    const filter = {"refreshToken":refreshToken}
    const update = {"refreshToken": ""}
    
    await Users.findOneAndUpdate(filter, update, {new:true} ).clone();

    res.clearCookie('jwt', { httpOnly: true }); // secure : true - only serves on https, but not now
    res.sendStatus(204);
}

module.exports = { handleLogout }