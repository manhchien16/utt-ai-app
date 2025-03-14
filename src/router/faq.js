const express = require("express");
const router = express.Router();
const { deleteFaqById } = require("../app/controllers/faqController");
require("dotenv").config();

router.delete("/faq/:id", deleteFaqById);

module.exports = router;
