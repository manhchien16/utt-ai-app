const express = require("express");
const cors = require("cors");
const router = express.Router();
const { handleUserQuery } = require("../app/controllers/messageController");
require("dotenv").config();

router.use(cors());

router.post("/chatbot/asks", handleUserQuery);

module.exports = router;
