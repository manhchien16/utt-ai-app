const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect("mongodb://127.0.0.1:27017/utt-app", {
  serverSelectionTimeoutMS: 5000,
});
// mongoose.connect(process.env.MONGO_URI, {
//   serverSelectionTimeoutMS: 5000,
// });

mongoose.connection.on("connected", () => {
  console.log("connected to mongoDB");
});

mongoose.connection.on("error", (err) => {
  console.log(`mongodb connection error: ${err}`);
});

module.exports = mongoose;
