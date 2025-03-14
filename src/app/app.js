const session = require("express-session");
const express = require("express");
const bodyParser = require("body-parser");
const { initializeSearch } = require("./services/singleton/initializeSearch");
const chatbotRouters = require("../router/chatbot");
const feedbackRouters = require("../router/feedback");
const faqRouters = require("../router/faq");
const chatLogRouters = require("../router/chatLog");
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
const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));

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

app.use("/api/v1", chatbotRouters);
app.use("/api/v1", feedbackRouters);
app.use("/api/v1", faqRouters);
app.use("/api/v1", chatLogRouters);
