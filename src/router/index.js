const chatbotRouters = require("../router/chatbot");
const faqRouters = require("../router/faq");
const chatLogRouters = require("../router/chatLog");
const modelRouters = require("../router/model");
const docsRouters = require("../router/document");
const healthRouters = require("../router/healthcheck");
const refreshTokenRouters = require("../router/token");
const authRouters = require("../router/auth");
const userRouters = require("../router/user");

const routers = (app) => {
  app.use("/api/v1/chatbot", chatbotRouters);
  app.use("/api/v1/faq", faqRouters);
  app.use("/api/v1/chatlog", chatLogRouters);
  app.use("/api/v1/model", modelRouters);
  app.use("/api/v1/docs", docsRouters);
  app.use("/api/v1/auth", authRouters);
  app.use("/api/v1", healthRouters);
  app.use("/api/v1", refreshTokenRouters);
  app.use("/api/v1", userRouters);
};

module.exports = { routers };
