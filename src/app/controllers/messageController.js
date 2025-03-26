const chatbotService = require("../services/chatbotService");

const handleUserQuery = async (req, res) => {
  try {
    const userQuery = req.body.userQuery;
    const userIP = req.ip;
    const resData = await chatbotService.handleUserQuery(userQuery, userIP);
    res.status(200).json(resData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const generateGpt4Response = async (req, res) => {
  try {
    const data = req.body;
    const userIP = req.ip;
    const resData = await chatbotService.generateGpt4Response(data, userIP);
    res.status(200).json(resData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  handleUserQuery,
  generateGpt4Response,
};
