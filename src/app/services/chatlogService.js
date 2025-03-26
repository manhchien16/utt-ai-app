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

//delete chatlog by useId
const deleteChatlogByUserIp = async (id) => {
  try {
    if (!id) throw new Error("Missing IP address");

    const result = await chatlogCollection.deleteMany({ user_ip: id });

    if (result.deletedCount === 0) {
      throw new Error("IP doesn't exist or no records found");
    }

    return { message: "Delete successfully!" };
  } catch (error) {
    throw new Error(error.message);
  }
};

//get chatlog by useIp
const getChatlogByUserIp = async (id) => {
  if (!id) throw new Error("Missing Ip address");
  const result = await chatlogCollection.find({ user_ip: id });
  return result;
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

module.exports = {
  getAllChatLogs,
  deleteChatLogById,
  saveFeedback,
  deleteChatlogByUserIp,
  getChatlogByUserIp,
};
