const express = require("express");
const router = express.Router();

router.get("/health", (req, res) => {
  try {
    res.status(200).json({ status: "ok" });
  } catch (error) {
    res.status(500).json({ status: "error" });
  }
});

module.exports = router;
