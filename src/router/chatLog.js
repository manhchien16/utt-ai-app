const express = require("express");
const router = express.Router();
const { deleteChatLogById } = require("../app/controllers/chatLogController");
const {
  getAllChatLogs,
  saveFeedback,
} = require("../app/controllers/messageController");
require("dotenv").config();

router.delete("/:id", deleteChatLogById);
router.get("/", getAllChatLogs);
router.patch("/:id/feedback", saveFeedback);

module.exports = router;
