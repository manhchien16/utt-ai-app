const initializeSearchService = require("../services/singleton/initializeSearch");

const resetFAQdata = async (req, res) => {
  try {
    await initializeSearchService.initializeSearch();
    res.status(200).json("model already");
  } catch (error) {
    res.status(500).json("model not already");
  }
};

module.exports = { resetFAQdata };
