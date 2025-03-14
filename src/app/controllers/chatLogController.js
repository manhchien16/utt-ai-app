const chatbotSevice = require("../services/chatbot");

const deleteChatLogById = async (req, res) => {
  try {
    const id = req.params.id;
    const newData = await chatbotSevice.deleteChatLogById(id);
    res.status(200).json(newData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  deleteChatLogById,
};
