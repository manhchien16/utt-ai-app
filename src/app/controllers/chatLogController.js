const chatlogService = require("../services/chatlogService");

const deleteChatLogById = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await chatlogService.deleteChatLogById(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllChatLogs = async (req, res) => {
  try {
    const result = await chatlogService.getAllChatLogs(res.params);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteChatlogByUserIp = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await chatlogService.deleteChatlogByUserIp(id);
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
    const result = await chatlogService.saveFeedback(data);
    res.status(200).json({ message: "Chat log saved", data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getChatlogByUserIp = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await chatlogService.getChatlogByUserIp(id);
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
