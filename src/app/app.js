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
const docsRouters = require("../router/document");
const healthRouters = require("../router/healthcheck");
const refreshTokenRouters = require("../router/token");
const authRouters = require("../router/auth");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const setupWebSocket = require("./services/websocket");
const http = require("http");

const { PCA } = require("ml-pca");
const { Matrix, SVD } = require("ml-matrix");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 8080;
// config cookie req
app.use(cookieParser());
// config body req
app.use(bodyParser.json());
//config session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);
//config cors
const corsOptions = {
  origin: process.env.CLIENT_URL,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));

// setup socket
setupWebSocket(server);
// config start server
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
app.use("/api/v1/docs", docsRouters);
app.use("/api/v1/auth", authRouters);
app.use("/api/v1", healthRouters);
app.use("/api/v1", refreshTokenRouters);
