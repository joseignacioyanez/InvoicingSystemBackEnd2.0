// New Authorization for Backend
// Author: Jose Ignacio Yanez
// Based on: https://www.youtube.com/watch?v=f2EqECiTBL8
const allowedOrigins = require('./allowedOrigins');

const corsOptions = {
    origin: (origin, callback) => {
        if(allowedOrigins.indexOf(origin) !== -1 || !origin){
            callback(null,true)
        }else{
            callback(new Error("Not allowed by CORS"));
        }
    },
    optionsSuccessStatus: 200
}

module.exports = corsOptions;