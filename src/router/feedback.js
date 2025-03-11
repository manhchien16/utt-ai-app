const express = require("express");
const router = express.Router();
const {
  saveFeedback,
  getAllChatLogs,
  getAllFAQ,
} = require("../app/controllers/messageController");
require("dotenv").config();

router.patch("/chatbot/:id/feedback", saveFeedback);
router.get("/chatbot/feedback", getAllChatLogs);
router.get("/chatbot/FAQ", getAllFAQ);

module.exports = router;
