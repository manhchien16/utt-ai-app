const { mongoose } = require("../../configuration/dbConfig");

const conversationSchema = new mongoose.Schema(
  {
    particepants: { type: [String], required: true },
    lastMessage: {
      senderId: { type: String },
      content: { type: String },
      timestamp: { type: Date },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "Conversation",
  conversationSchema,
  "conversation"
);
