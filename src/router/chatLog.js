const express = require("express");
const router = express.Router();
const { deleteChatLogById } = require("../app/controllers/chatLogController");
require("dotenv").config();

router.delete("/chatlog/:id", deleteChatLogById);

module.exports = router;
