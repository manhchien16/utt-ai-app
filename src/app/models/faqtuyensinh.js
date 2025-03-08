const mongoose = require("../../configuration/dbConfig");

const faqtuyensinhSchema = new mongoose.Schema(
  {
    Question: {
      type: String,
      required: true,
    },
    Answer: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Faqtuyensinh",
  faqtuyensinhSchema,
  "faqtuyensinh"
);
