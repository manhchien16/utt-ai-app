const express = require("express");
const {
  getDocument,
  writeDocument,
  downloadDocFile,
} = require("../app/controllers/docsController");
const router = express.Router();

router.get("/", getDocument);
router.patch("/", writeDocument);
router.get("/download", downloadDocFile);

module.exports = router;
