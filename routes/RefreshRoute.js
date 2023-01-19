// New Authorization for Backend
// Author: Jose Ignacio Yanez
// Based on: https://www.youtube.com/watch?v=f2EqECiTBL8

const express = require("express");
const router = express.Router();
const refreshTokenController = require("../controllers/refreshTokenController");

router.get("/", refreshTokenController.handleRefreshToken);

module.exports = router;