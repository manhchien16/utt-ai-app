const express = require("express");
const router = express.Router();
const {
  handleUserQuery,
  generateGpt4Response,
} = require("../app/controllers/messageController");
require("dotenv").config();

router.post("/chatbot/asks", handleUserQuery);
router.post("/chatbot/askbygpt", generateGpt4Response);

module.exports = router;
