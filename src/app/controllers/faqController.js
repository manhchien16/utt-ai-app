const faqService = require("../services/faqService");
const faqController = {
  add: async (req, res) => {
    try {
      await faqService.saveFAQData(req.body);
      res.status(200).json({ message: "success" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  delete: async (req, res) => {
    try {
      const ids = req.body.ids;
      const result = await faqService.deleteFaqById(ids);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getAll: async (req, res) => {
    try {
      const result = await faqService.getAllFAQ();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = {
  faqController,
};
