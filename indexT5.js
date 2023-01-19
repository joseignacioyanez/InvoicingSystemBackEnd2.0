const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser")
const cors = require('cors');
const { logger }  = require("./middleware/logEvents")
const verifyJWT = require('./middleware/verifyJWT') // For autenthication
const cookieParser = require('cookie-parser');
const corsOptions = require('./config/corsOptions');
const credentials = require('./middleware/credentials');
// Roles
const ROLES_LIST = require('./config/roles_list');
const verifyRoles = require('./middleware/verifyRoles');
// Use environment variables for DB, PORT and WhatsApp
require("dotenv").config()

// Middleware

// Custom Logger
app.use(logger);

// Handle credentials check before CORS
// and requirement for fetch or axios
app.use(credentials);

// Cors Cross Site  Resource Sharing Problems
// TODO Analyze if necesary to creat a Whitelist for AWS ans corsOptions or just Open
app.use(cors(corsOptions));


// Parser for error we had in class on POST when parsing body of Request
// modified from Tema 2 Tutorial 
// and https://stackoverflow.com/questions/69913477/cannot-read-properties-of-undefined-in-nodejs
app.use(bodyParser.urlencoded({extended: false})) // Form data
app.use(bodyParser.json()) // Json Data

// Midleware for cookies
app.use(cookieParser());

// Static files, not needed for now

// Routes 
const routesMenuItems = require("./routes/MenuItemRoutes");
const routesUsers = require("./routes/UsersRoutes");
const routesInvoices = require("./routes/InvoiceRoutes");
const routesClients = require("./routes/ClientRoutes");
const routeLogin = require("./routes/LoginRoute");
const routeRefresh = require("./routes/RefreshRoute");
const routeLogout = require("./routes/LogoutRoute");
// Route with no Auth
app.use("/login", routeLogin)
app.use("/refresh", routeRefresh)
app.use("/logout", routeLogout)

// Routes Protected By Authentication
app.use(verifyJWT)
app.use('/restaurant', routesMenuItems, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Cashier))
app.use('/restaurant', routesUsers, verifyRoles(ROLES_LIST.Admin))
app.use('/restaurant', routesInvoices, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Cashier))
app.use('/restaurant', routesClients, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Cashier))

// Connect to DB Using Environment Variables
console.log("this are the credentials: " + process.env.MONGO_USER_T5 + process.env.MONGO_PSWD_T5)
url = `mongodb+srv://${process.env.MONGO_USER_T5}:${process.env.MONGO_PSWD_T5}@mongoji.nf5scze.mongodb.net/WAD_1_Invoicing_SantoPlacer?retryWrites=true&w=majority`;
const database = mongoose.connection;
mongoose.connect(url);
database.on("error", console.error.bind(console, "Error connecting to MongoDB"));
database.once('connected', () => {console.log("Succesfuly connected to MongoDB")});

app.use(express.json())

app.listen(process.env.PORT_T5, () => {
    console.log(`Server Running in Port ${process.env.PORT_T5}`)
})

// Make an Index for the API TODO
app.get("/restaurant", function(req,res) {
    res.send("Hello World!")
})