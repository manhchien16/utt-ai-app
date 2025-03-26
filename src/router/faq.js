const express = require("express");
const router = express.Router();
const {
  deleteFaqById,
  getAllFAQ,
} = require("../app/controllers/faqController");
require("dotenv").config();

router.delete("/delete", deleteFaqById);
router.get("/", getAllFAQ);

module.exports = router;
