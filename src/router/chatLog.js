const express = require("express");
const router = express.Router();
const {
  deleteChatLogById,
  getAllChatLogs,
  saveFeedback,
  deleteChatlogByUserIp,
  getChatlogByUserIp,
} = require("../app/controllers/chatLogController");
require("dotenv").config();

router.delete("/:id", deleteChatLogById);
router.get("/", getAllChatLogs);
router.patch("/:id/feedback", saveFeedback);
router.delete("/:id/userip", deleteChatlogByUserIp);
router.get("/:id/userip", getChatlogByUserIp);

module.exports = router;
