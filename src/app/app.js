const session = require("express-session");
const express = require("express");
const bodyParser = require("body-parser");
const {
  initializeSearch,
  initializeSearchDoc,
} = require("./services/singleton/initializeSearch");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const setupWebSocket = require("./services/websocket");
const http = require("http");
const { routers } = require("../router");
const { corsOptions } = require("../configuration/corsConfig");

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
routers(app);
