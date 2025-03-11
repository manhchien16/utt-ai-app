const chatbotSevice = require("../services/chatbot");

const handleUserQuery = async (req, res) => {
  try {
    const userQuery = req.body.userQuery;
    const userIP = req.ip;
    const resData = await chatbotSevice.handleUserQuery(userQuery, userIP);
    res.status(200).json(resData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const saveFeedback = async (req, res) => {
  try {
    const data = {
      id: req.params.id,
      feedback: req.body.feedback,
    };
    const dataRes = await chatbotSevice.saveFeedback(data);
    res.status(200).json({ message: "Chat log saved", data: dataRes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllChatLogs = async (req, res) => {
  try {
    const chatLogs = await chatbotSevice.getAllChatLogs();
    res.status(200).json(chatLogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllFAQ = async (req, res) => {
  try {
    const faqs = await chatbotSevice.getAllFAQ();
    res.status(200).json(faqs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  handleUserQuery,
  getAllChatLogs,
  saveFeedback,
  getAllFAQ,
};
