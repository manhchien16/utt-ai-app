const mongoose = require("mongoose");
const config = require("config");

mongoose
  .connect(config.get("db.mongodb"), {})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

module.exports = mongoose;
