const session = require("express-session");
const express = require("express");
const bodyParser = require("body-parser");
const {
  initializeSearch,
  initializeSearchDoc,
} = require("./services/singleton/initializeSearch");
const chatbotRouters = require("../router/chatbot");
const faqRouters = require("../router/faq");
const chatLogRouters = require("../router/chatLog");
const modelRouters = require("../router/model");
const cors = require("cors");
const { PCA } = require("ml-pca");
const { Matrix, SVD } = require("ml-matrix");

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
  origin: process.env.DOMAIN_FE,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));

// cofig start server
const startServer = async () => {
  try {
    await initializeSearchDoc();
    await initializeSearch();
    app.listen(PORT, () => {
      console.log(`Server is running on ${PORT}`);
    });
  } catch (error) {
    console.error("Error running server:", error);
  }
};
startServer();

app.use("/api/v1/chatbot", chatbotRouters);
app.use("/api/v1/faq", faqRouters);
app.use("/api/v1/chatlog", chatLogRouters);
app.use("/api/v1/model", modelRouters);
