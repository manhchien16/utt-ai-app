const express = require("express");
const router = express.Router();
const {
  resetFAQdata,
} = require("../app/controllers/initializeSearchController");
require("dotenv").config();

router.post("/reset", resetFAQdata);

module.exports = router;
