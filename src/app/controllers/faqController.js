const faqService = require("../services/faq");

const deleteFaqById = async (req, res) => {
  try {
    const id = req.params.id;
    const newData = await faqService.deleteFaqById(id);
    res.status(200).json(newData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllFAQ = async (req, res) => {
  try {
    const faqs = await faqService.getAllFAQ();
    res.status(200).json(faqs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  deleteFaqById,
  getAllFAQ,
};
