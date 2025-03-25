const { areObjectValid } = require("../../common/functionCommon");
const chatlogCollection = require("../models/chatlog");

// delete ChatLog
const deleteChatLogById = async (id) => {
  try {
    if (id) {
      await chatlogCollection.findByIdAndDelete(id);
      return "Delete Success!";
    }
  } catch (error) {
    throw new Error(error.message);
  }
};
// Get all chat logs
const getAllChatLogs = async () => {
  try {
    return await chatlogCollection.find({}, "-__v").lean();
  } catch (error) {
    throw new Error(error.message);
  }
};

// save feedback
const saveFeedback = async (data) => {
  try {
    if (!areObjectValid(["id", "feedback"], data)) {
      throw new Error("Data is invalid");
    }
    const findFeedback = await chatlogCollection.findById(data.id);
    if (!findFeedback) {
      throw new Error("data not found");
    }
    const updateChatlog = await chatlogCollection.findByIdAndUpdate(
      findFeedback._id,
      {
        is_good: false,
        problem_detail: data.feedback,
      },
      { new: true }
    );

    return updateChatlog;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = { getAllChatLogs, deleteChatLogById, saveFeedback };
