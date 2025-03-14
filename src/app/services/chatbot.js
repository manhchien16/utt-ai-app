const { areObjectValid } = require("../../common/functionCommon");
const faqCollection = require("../models/faqtuyensinh");
const chatlogCollection = require("../models/chatlog");
const { OpenAI } = require("openai");
const mammoth = require("mammoth");
const fs = require("fs-extra");
require("dotenv").config();
require("@tensorflow/tfjs-node");

const { getSearchData } = require("./singleton/initializeSearch");
const cosineSimilarity = require("compute-cosine-similarity");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// findBestMatch in FAQ
const findBestMatch = async (userQuery) => {
  try {
    if (!userQuery) throw new Error("Data is invalid");
    const { encoder, faissIndex, faqEmbeddings } = getSearchData();

    const faqData = await faqCollection.find({}, "-_id Question").lean();

    const queryEmbedding = await encoder.embed([userQuery]);
    const queryArray = queryEmbedding.arraySync().flat();

    const { labels } = faissIndex.search(queryArray, 3);

    const bestMatchIndex = labels[0];

    const faqEmbeddingsArray = faqEmbeddings.arraySync();
    const bestMatchEmbedding = faqEmbeddingsArray[bestMatchIndex];

    const topMatch = labels.map((item, index) => ({
      match: faqData[item].Question,
      score: cosineSimilarity(queryArray, faqEmbeddingsArray[item]),
    }));

    return topMatch;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Hàm tính khoảng cách Euclidean
const euclideanDistance = (vecA, vecB) => {
  if (vecA.length !== vecB.length) return Infinity;
  return Math.sqrt(
    vecA.reduce((sum, val, i) => sum + Math.pow(val - vecB[i], 2), 0)
  );
};

// Search in document
const searchInDocument = async (query, docPath) => {
  if (!fs.existsSync(docPath)) return null;
  try {
    const { value: text } = await mammoth.extractRawText({ path: docPath });
    const matches = text
      .split("\n")
      .filter((p) => p.toLowerCase().includes(query.toLowerCase()));
    return matches.length ? matches.slice(0, 3).join("\n") : null;
  } catch (error) {
    throw new Error("Lỗi khi đọc file: " + error.message);
  }
};

// Search in GPT-4
const generateGpt4Response = async (userQuery, userIP) => {
  try {
    if (typeof userQuery !== "string" || !userQuery)
      throw new Error("Data is invalid");
    const prompt = `Một sinh viên hỏi: ${userQuery}\n\nDựa trên thông tin tìm được trên internet, hãy cung cấp một câu trả lời hữu ích, ngắn gọn và thân thiện. Dẫn nguồn nếu có thể.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Bạn là một trợ lý tuyển sinh đại học hữu ích.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 3500,
    });

    const newData = {
      user_ip: userIP,
      timestamp: new Date(),
      user_message: userQuery,
      bot_response: response.choices[0].message.content,
    };
    const responseGPT = await saveChatLog(newData);

    return responseGPT;
  } catch (error) {
    throw new Error(error.message);
  }
};

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

// Save chat log
const saveChatLog = async (data) => {
  try {
    if (!areObjectValid(["user_ip", "user_message", "bot_response"], data)) {
      throw new Error("Data is invalid");
    }
    const createChatlog = await chatlogCollection.insertOne({
      user_ip: data.user_ip,
      timestamp: new Date(),
      user_message: data.user_message,
      bot_response: data.bot_response,
      is_good: !data.feedback,
      problem_detail: data.feedback || "",
    });
    return createChatlog;
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

// Get all chat logs
const getAllChatLogs = async () => {
  try {
    return await chatlogCollection.find({}, "-__v").lean();
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

// Handle user query
const handleUserQuery = async (userQuery, userIP) => {
  try {
    if (!userQuery) throw new Error("Data is invalid");
    const topMatch = await findBestMatch(userQuery);
    let response;
    const bestMatch = topMatch.reduce(
      (max, item) => (item.score > max.score ? item : max),
      { match: "", score: -Infinity }
    );

    if (bestMatch.score < 0.86) {
      response = topMatch;
    } else {
      const responseFaq = await faqCollection.findOne({
        Question: bestMatch.match,
      });

      const newData = {
        user_ip: userIP,
        timestamp: new Date(),
        user_message: userQuery,
        bot_response: responseFaq.Answer,
      };
      response = await saveChatLog(newData);
    }
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  handleUserQuery,
  generateGpt4Response,
  saveFeedback,
  getAllChatLogs,
  getAllFAQ,
  deleteFaqById,
  deleteChatLogById,
};
