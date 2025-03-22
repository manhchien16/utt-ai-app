const express = require("express");
const router = express.Router();
const { deleteFaqById } = require("../app/controllers/faqController");
const { getAllFAQ } = require("../app/controllers/messageController");
require("dotenv").config();

router.delete("/:id", deleteFaqById);
router.get("/", getAllFAQ);

module.exports = router;
