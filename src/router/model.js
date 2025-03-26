const express = require("express");
const router = express.Router();
const {
  resetFAQdata,
  resetDocData,
} = require("../app/controllers/initializeSearchController");
require("dotenv").config();

router.post("/resetfaq", resetFAQdata);
router.post("/resetdoc", resetDocData);

module.exports = router;
