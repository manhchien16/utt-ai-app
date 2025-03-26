const mongoose = require("../../configuration/dbConfig");

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["admin", "data", "customer"],
      default: "customer",
    },
    google_id: {
      type: String,
      default: "",
    },
    facebook_id: {
      type: String,
      default: "",
    },
    phoneNumber: {
      type: String,
      default: "",
    },
    fullName: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Users", userSchema, "users");
