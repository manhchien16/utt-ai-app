const jwt = require("jsonwebtoken");
const {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
} = require("../configuration/jwtConfig");

const generateAccessToken = async (user) => {
  try {
    const payload = {
      _id: user._id,
      name: user.fullName,
      role: user.role,
      email: user.email,
    };
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "1d" });
  } catch (error) {
    throw new Error(error.message);
  }
};

const generateRefreshToken = async (user) => {
  try {
    const payload = {
      _id: user._id,
    };
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: "365d" });
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = { generateAccessToken, generateRefreshToken };
