const express = require("express");
const router = express.Router();
const { faqController } = require("../app/controllers/faqController");
require("dotenv").config();

router.delete("/:id", faqController.delete);
router.get("/", faqController.getAll);
router.post("/", faqController.add);

module.exports = router;
