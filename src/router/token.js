const express = require("express");
const { refreshToken } = require("../app/controllers/token");
const router = express.Router();
require("dotenv").config();

router.post("/refresh", refreshToken);

module.exports = router;
