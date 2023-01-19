// New Authorization for Backend
// Author: Jose Ignacio Yanez
// Based on: https://www.youtube.com/watch?v=f2EqECiTBL8

const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController")

//Login
router.post("/", authController.handleLogin);

module.exports = router;