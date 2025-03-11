const session = require("express-session");
const express = require("express");
const bodyParser = require("body-parser");
const { initializeSearch } = require("./services/singleton/initializeSearch");
const chatbotRouter = require("../router/chatbot");
const feedbackRouter = require("../router/feedback");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8080;
app.use(bodyParser.json());
//cofig session
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
//cofig cors
app.use(cors());

//cofig start server
const startServer = async () => {
  try {
    await initializeSearch();
    app.listen(PORT, () => {
      console.log(`Server is running in http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error running server:", error);
  }
};
startServer();

app.use("/api/v1", chatbotRouter);
app.use("/api/v1", feedbackRouter);
