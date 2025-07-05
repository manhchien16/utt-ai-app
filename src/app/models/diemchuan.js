const { mongoose } = require("../../configuration/dbConfig");

const diemChuanSchema = new mongoose.Schema(
  {
    Score: {
      type: Number,
      required: true,
    },
    ScoreType: {
      type: String,
      required: true,
    },
    Field: {
      type: String,
      required: true,
    },
    Year: {
      type: Number,
      required: true,
    },
    Question: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("diemChuan", diemChuanSchema, "diemchuan");
