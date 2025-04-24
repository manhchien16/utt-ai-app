const { mongoose } = require("../../configuration/dbConfig");

const chatlogSchema = new mongoose.Schema(
  {
    user_ip: {
      type: String,
      required: true,
    },
    user_message: {
      type: String,
      required: true,
    },
    bot_response: {
      type: String,
      required: true,
    },
    problem_detail: {
      type: String,
      default: "",
    },
    is_good: {
      type: String,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Chatlog", chatlogSchema, "chatlog");
