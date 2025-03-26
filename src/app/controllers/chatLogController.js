const chatbotSevice = require("../services/chatlogService");

const deleteChatLogById = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await chatbotSevice.deleteChatLogById(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllChatLogs = async (req, res) => {
  try {
    const result = await chatlogSerice.getAllChatLogs();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteChatlogByUserIp = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await chatlogSerice.deleteChatlogByUserIp(id);
    res.status(200).json(result);
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
    const result = await chatlogSerice.saveFeedback(data);
    res.status(200).json({ message: "Chat log saved", data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getChatlogByUserIp = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await chatbotSevice.getChatlogByUserIp(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  deleteChatLogById,
  getAllChatLogs,
  saveFeedback,
  deleteChatlogByUserIp,
  getChatlogByUserIp,
};
