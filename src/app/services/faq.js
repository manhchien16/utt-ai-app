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
const deleteFaqById = async (id) => {
  try {
    if (id) {
      await faqCollection.findByIdAndDelete(id);
      return "Delete Success!";
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

// Get all FAQ
const getAllFAQ = async () => {
  try {
    return await faqCollection.find({}, "-__v").lean();
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = { saveFAQData, deleteFaqById, getAllFAQ };
