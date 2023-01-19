// New Authorization for Backend
// Author: Jose Ignacio Yanez
// Based on: https://www.youtube.com/watch?v=f2EqECiTBL8

const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if(!req?.roles) return res.sendStatus(401);
        const rolesArray = [...allowedRoles];
        const result = req.roles.map(role => rolesArray.includes(role)).find(val => val === true);//Array with true or false if roles match, if at least ne true, it accepts
        if(!result) return res.sendStatus(401);
        next();
    }
}

module.exports = verifyRoles;