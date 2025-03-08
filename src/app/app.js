const session = require("express-session");
const express = require("express");
const bodyParser = require("body-parser");
const { initializeSearch } = require("./services/singleton/initializeSearch");
const chatbotRouter = require("../router/chatbot");
const feedbackRouter = require("../router/feedback");

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
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});

const startServer = async () => {
  try {
    await initializeSearch();
  } catch (error) {
    console.error("Lỗi khi khởi động server:", error);
  }
};
startServer();

app.use("/api/v1", chatbotRouter);
app.use("/api/v1", feedbackRouter);
