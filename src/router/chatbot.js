const express = require("express");
const router = express.Router();
const { handleUserQuery } = require("../app/controllers/messageController");
require("dotenv").config();

router.post("/chatbot/asks", handleUserQuery);

module.exports = router;
