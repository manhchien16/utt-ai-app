const authService = require("../services/authService");
require("dotenv").config();

const loginByGoogle = async (req, res) => {
  try {
    const data = req.user;
    const { accessToken, refreshToken, user } = await authService.loginByGoogle(
      data
    );
    res.cookie("refreshToken", refreshToken),
      {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 365 * 24 * 60 * 60 * 1000,
      };
    res.redirect(`${process.env.CLIENT_URL}?accessToken=${accessToken}`);
  } catch (error) {
    res.redirect(`${process.env.CLIENT_URL}?error=${error.message}`);
  }
};

const loginByFacebook = async (req, res) => {
  try {
    const data = req.user;
    const { accessToken, refreshToken, user, role } =
      await authService.loginByFacebook(data);
    console.log({ accessToken, refreshToken, user, role });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 365 * 24 * 60 * 60 * 1000,
    });
    res.redirect(`${process.env.CLIENT_URL}?accessToken=${accessToken}`);
  } catch (error) {
    console.log("Login error:", error.message);
    res.redirect(`${process.env.CLIENT_URL}?error=${error.message}`);
  }
};

module.exports = { loginByGoogle, loginByFacebook };
