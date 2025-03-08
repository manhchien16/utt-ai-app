const { areObjectValid } = require("../../common/functionCommon");
const faqCollection = require("../models/faqtuyensinh");
const chatlogCollection = require("../models/chatlog");
const { OpenAI } = require("openai");
const mammoth = require("mammoth");
const fs = require("fs-extra");
require("dotenv").config();
const tf = require("@tensorflow/tfjs-node");
const cosineSimilarity = require("compute-cosine-similarity");
const { getSearchData } = require("./singleton/initializeSearch");
const e = require("express");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// findBestMatch in FAQ
const findBestMatch = async (userQuery) => {
  try {
    const { encoder, faqEmbeddings } = getSearchData();

    const faqData = await faqCollection.find({}, "-_id Question").lean();

    const queryEmbedding = await encoder.embed([userQuery]);
    const queryArray = queryEmbedding.arraySync().flat();

    let bestMatchIndex = -1;
    let maxSimilarity = -1; // Cosine similarity value -1 to 1

    const allEmbeddings = faqEmbeddings.arraySync();
    for (let i = 0; i < allEmbeddings.length; i++) {
      const similarity = cosineSimilarity(queryArray, allEmbeddings[i]);
      if (similarity > maxSimilarity) {
        maxSimilarity = similarity;
        bestMatchIndex = i;
      }
    }

    return {
      match: faqData[bestMatchIndex] || "Không tìm thấy",
      score: maxSimilarity,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

// Euclidean
const euclideanDistance = (a, b) => {
  return Math.sqrt(a.reduce((sum, val, i) => sum + (val - b[i]) ** 2, 0));
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
const generateGpt4Response = async (userQuery) => {
  if (typeof userQuery !== "string") {
    throw new Error("🚨 userQuery phải là một chuỗi!");
  }
  try {
    const prompt = `Một sinh viên hỏi: ${userQuery}\n\nDựa trên thông tin tìm được trên internet, hãy cung cấp một câu trả lời hữu ích, ngắn gọn và thân thiện. Dẫn nguồn nếu có thể.`;
    console.log(prompt);

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Bạn là một trợ lý tuyển sinh đại học hữu ích.",
        },
        { role: "user", content: prompt },
      ],
      stream: true,
      max_tokens: 3500,
    });

    return response.choices[0].message.content;
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
    return await chatlogCollection.insertOne({
      user_ip: data.user_ip,
      timestamp: new Date(),
      user_message: data.user_message,
      bot_response: data.bot_response,
      is_good: !data.feedback,
      problem_detail: data.feedback || "",
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

// save feedback
const saveFeedback = async (data) => {
  try {
    console.log(data);

    if (!areObjectValid(["id", "feedback"], data)) {
      throw new Error("Data is invalid");
    }
    const findFeedback = await chatlogCollection.findById(data.id);
    if (!findFeedback) {
      throw new Error("data not found");
    }
    const dataRes = await chatlogCollection.findByIdAndUpdate(
      findFeedback._id,
      {
        is_good: false,
        problem_detail: data.feedback,
      },
      { new: true }
    );
    console.log(dataRes);

    return dataRes;
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

// Handle user query
const handleUserQuery = async (userQuery, userIP) => {
  try {
    const { match, score } = await findBestMatch(userQuery);
    let response;

    console.log("match:", match);
    console.log("score:", score);

    if (score < 0.7) {
      response = await generateGpt4Response(userQuery);
      const newData = {
        user_ip: userIP,
        timestamp: new Date(),
        user_message: userQuery,
        bot_response: response,
      };
      await saveChatLog(newData);
    } else {
      response = await faqCollection.findOne(
        {
          Question: match.Question,
        },
        "-__v"
      );
    }

    console.log("respornse:", response);
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = { handleUserQuery, saveFeedback, getAllChatLogs };
