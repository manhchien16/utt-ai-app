const chatbotSevice = require("../services/chatbot");

const deleteFaqById = async (req, res) => {
  try {
    const id = req.params.id;
    const newData = await chatbotSevice.deleteFaqById(id);
    res.status(200).json(newData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  deleteFaqById,
};
