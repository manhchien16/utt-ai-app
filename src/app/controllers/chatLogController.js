const chatbotSevice = require("../services/chatbot");
const chatlogSerice = require("../services/chatlog");

const deleteChatLogById = async (req, res) => {
  try {
    const id = req.params.id;
    const newData = await chatbotSevice.deleteChatLogById(id);
    res.status(200).json(newData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllChatLogs = async (req, res) => {
  try {
    const chatLogs = await chatlogSerice.getAllChatLogs();
    res.status(200).json(chatLogs);
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
    const dataRes = await chatlogSerice.saveFeedback(data);
    res.status(200).json({ message: "Chat log saved", data: dataRes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  deleteChatLogById,
  getAllChatLogs,
  saveFeedback,
};
