const { generateAccessToken } = require("../../utils/jwtUtlis");
const { verifyToken } = require("../middleware/jwtMiddleware");
const userCollection = require("../models/user");

const refreshToken = async (refreshTokenFromCookie) => {
  try {
    const decode = verifyToken(refreshTokenFromCookie, "refresh");
    const user = await userCollection.findById(decode._id);
    if (!user) throw new Error("User not found");
    const payload = {
      _id: user._id,
      name: user.fullName,
      role: user.role,
      email: user.email,
    };
    const newAccessToken = generateAccessToken(payload);
    return newAccessToken;
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }
};

module.exports = { refreshToken };
