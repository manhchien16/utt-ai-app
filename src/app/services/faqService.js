const faqCollection = require("../models/faqtuyensinh");

// save FAQ data
const saveFAQData = async (data) => {
  try {
    if (!areObjectValid(["Question", "Answer"], data)) {
      throw new Error("Data is invalid");
    }
    const createFAQ = await faqCollection.insertOne(data);
    return createFAQ;
  } catch (error) {
    throw new Error(error.message);
  }
};
// delete FAQ
const deleteFaqById = async (ids) => {
  try {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new Error("Data is invalid");
    }

    const result = await faqCollection.deleteMany({ _id: { $in: ids } });

    if (result.deletedCount === 0) {
      throw new Error("Not FAQ Data");
    }

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Get all FAQ
const getAllFAQ = async (params) => {
  try {
    return await faqCollection.find({}, "-__v").lean();
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = { saveFAQData, deleteFaqById, getAllFAQ };
