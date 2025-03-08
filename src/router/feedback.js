const express = require("express");
const cors = require("cors");
const router = express.Router();
const {
  saveFeedback,
  getAllChatLogs,
} = require("../app/controllers/messageController");
require("dotenv").config();

router.use(cors());

router.patch("/chatbot/:id/feedback", saveFeedback);
router.get("/chatbot/feedback", getAllChatLogs);

module.exports = router;
