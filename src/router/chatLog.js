const express = require("express");
const router = express.Router();
const {
  deleteChatLogById,
  getAllChatLogs,
  saveFeedback,
} = require("../app/controllers/chatLogController");
require("dotenv").config();

router.delete("/:id", deleteChatLogById);
router.get("/", getAllChatLogs);
router.patch("/:id/feedback", saveFeedback);

module.exports = router;
