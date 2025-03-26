const express = require("express");
const passport = require("../configuration/passport");
const {
  loginByGoogle,
  loginByFacebook,
} = require("../app/controllers/authController");
const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL}`,
    session: false,
  }),
  async (req, res, next) => {
    try {
      await loginByGoogle(req, res);
    } catch (error) {
      console.error("Error during google callback:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"], session: false })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: `${process.env.CLIENT_URL}`,
    session: false,
  }),
  async (req, res, next) => {
    try {
      await loginByFacebook(req, res);
    } catch (error) {
      console.error("Error during Facebook callback:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

module.exports = router;
