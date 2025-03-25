const initializeSearchService = require("../services/singleton/initializeSearch");

const resetFAQdata = async (req, res) => {
  try {
    await initializeSearchService.initializeSearch();
    res.status(200).json({ message: "model already" });
  } catch (error) {
    res.status(500).json({ message: "model not already" });
  }
};

const resetDocData = async (req, res) => {
  try {
    await initializeSearchService.initializeSearchDoc();
    res.status(200).json({ message: "model already" });
  } catch (error) {
    res.status(500).json({ message: "model not already" });
  }
};

module.exports = { resetFAQdata, resetDocData };
