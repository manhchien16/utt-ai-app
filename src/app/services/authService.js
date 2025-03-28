const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../utils/jwtUtlis");
const userCollection = require("../models/user");

const loginByGoogle = async (profile) => {
  try {
    if (!profile) throw new Error("Data is invalid");
    const { id, displayName } = profile;
    const email =
      profile.emails && profile.emails.length > 0
        ? profile.emails[0].value
        : null;

    const user = await userCollection.findOne({ email: email });
    if (user) {
      const payload = {
        _id: user._id,
        name: user.fullName,
        role: user.role,
        email: user.email,
      };
      const accessToken = await generateAccessToken(payload);
      const refreshToken = await generateRefreshToken(payload);
      return {
        accessToken,
        refreshToken,
        user: user,
      };
    } else {
      const newUser = new userCollection({
        fullName: displayName,
        facebook_id: id,
        email: email,
      });
      const saveUser = await newUser.save();
      const payload = {
        _id: saveUser._id,
        name: saveUser.fullName,
        role: saveUser.role,
        email: saveUser.email,
      };
      const accessToken = await generateAccessToken(payload);
      const refreshToken = await generateRefreshToken(payload);
      return {
        accessToken,
        refreshToken,
        user: saveUser,
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const loginByFacebook = async (profile) => {
  try {
    console.log(profile);

    if (!profile) throw new Error("Data is invalid");
    const { id, name } = profile;
    const email =
      profile.emails && profile.emails.length > 0
        ? profile.emails[0].value
        : null;

    const user = await userCollection.findOne({ email: email });
    if (user) {
      const payload = {
        _id: user._id,
        name: user.fullName,
        role: user.role,
        email: user.email,
      };
      const accessToken = await generateAccessToken(payload);
      const refreshToken = await generateRefreshToken(payload);
      return {
        accessToken,
        refreshToken,
        user: user,
      };
    } else {
      const newUser = new userCollection({
        fullName: name,
        facebook_id: id,
        email: email,
      });
      const saveUser = await newUser.save();
      const payload = {
        _id: saveUser._id,
        name: saveUser.fullName,
        role: saveUser.role,
        email: saveUser.email,
      };
      const accessToken = await generateAccessToken(payload);
      const refreshToken = await generateRefreshToken(payload);
      return {
        accessToken,
        refreshToken,
        user: saveUser,
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = { loginByGoogle, loginByFacebook };
