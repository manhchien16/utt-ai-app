const {
  areObjectValid,
  cosineSimilarity,
} = require("../../common/functionCommon");
const faqCollection = require("../models/faqtuyensinh");
const chatlogCollection = require("../models/chatlog");
const { OpenAI } = require("openai");
const mammoth = require("mammoth");
const fs = require("fs-extra");
require("dotenv").config();

const { getSearchData } = require("./singleton/initializeSearch");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// findBestMatch in FAQ
const findBestMatch = async (userQuery) => {
  try {
    if (!userQuery) throw new Error("Data is invalid");
    const { encoder, faissIndex, faqEmbeddings } = getSearchData();

    const faqData = await faqCollection.find({}, "-_id Question").lean();

    const convertQuery = [userQuery];
    const queryEmbedding = await Promise.all(
      convertQuery.map(async (q) => {
        const embedding = await encoder(q, { pooling: "mean" });
        return embedding.tolist()[0];
      })
    );
    const queryArray = Array.from(new Float32Array(queryEmbedding.flat()));

    const { labels, distances } = faissIndex.search(queryArray, 15);

    const faqEmbeddingsArray = faqEmbeddings;

    const topMatch = labels
      .map((item, index) => ({
        match: faqData[item]?.Question || "Dữ liệu lỗi",
        score: cosineSimilarity(
          queryArray,
          Array.from(faqEmbeddingsArray[item] || [])
        ),
      }))
      .sort((a, b) => b.score - a.score);

    return topMatch.slice(0, Math.min(6, topMatch.length));
  } catch (error) {
    throw new Error(error.message);
  }
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
// Find by keyword
const generateNewQuery = async (userQuery, data) => {
  try {
    const isValid = data.every((item) => areObjectValid(["match"], item));
    if (
      !isValid ||
      !areObjectValid(["userQuery"], {
        userQuery,
      })
    ) {
      throw new Error("Data is invalid");
    }

    const convertMatch = data.map((item) => item.match).join(". ") + "...";

    const prompt = `Thông tin tham khảo: ${convertMatch} \nMột người có câu hỏi "${userQuery}":\nDựa trên các câu hỏi được cung cấp ở "Thông tin tham khảo", hãy cung cấp cho tôi câu hỏi có trong Thông tin tham khảo có ý nghĩa giống với câu hỏi của người dùng nhất.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "Bạn là một trợ lý lọc câu hỏi trường đại học Công Nghệ Giao Thông Vận Tải (UTT) hữu ích, nếu người dùng hỏi hãy chỉ trả về câu trả với có cấu trúc như ví dụ ví dụ: Địa chỉ các trụ sở?, nếu không có câu trả lời nào thì chỉ trả về 1 chữ: Null",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 500,
    });
    // console.log(response.choices[0].message.content);
    return response.choices[0].message.content;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Search in GPT-4
const generateGpt4Response = async (userQuery, data, userIP) => {
  try {
    const isValid = areObjectValid(["userQuery", "userIP"], {
      userQuery,
      userIP,
    });
    if (!isValid || !data.every((item) => areObjectValid(["match"], item))) {
      throw new Error("Data is invalid");
    }
    const additionalData = await Promise.all(
      data.map(async (item) => {
        const answer = await faqCollection.findOne({ Question: item.match });
        return answer.Question + ":" + answer.Answer + ";";
      })
    );
    const contextInfo =
      additionalData.length > 0
        ? `\n\nThông tin tham khảo:\n${additionalData.join("\n")}`
        : "";

    const prompt = `Một sinh viên hỏi: ${userQuery}\n\nDựa trên thông tin tìm được trên internet và dữ liệu có sẵn, hãy cung cấp một câu trả lời hữu ích, ngắn gọn và thân thiện. Dẫn nguồn nếu có thể.${contextInfo}`;

    // console.log(prompt);

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "Bạn là một trợ lý tuyển sinh trường đại học Công Nghệ Giao Thông Vận Tải (UTT) hữu ích",
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
    return {
      ...responseGPT._doc,
      bestQuestion: userQuery,
    };
  } catch (error) {
    // console.log(error);

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

//generateBestMatch
const generateBestMatch = async (userQuery, question, userIP) => {
  const isValid = areObjectValid(["userQuery", "question", "userIP"], {
    userQuery,
    question,
    userIP,
  });
  if (!isValid) {
    throw new Error("Data is invalid");
  }
  const responseFaq = await faqCollection.findOne({
    Question: question,
  });

  const newData = {
    user_ip: userIP,
    timestamp: new Date(),
    user_message: userQuery,
    bot_response: responseFaq.Answer,
  };
  const resChatLog = await saveChatLog(newData);
  return {
    ...resChatLog._doc,
    bestQuestion: question,
  };
};

// Handle user query
const handleUserQuery = async (userQuery, userIP) => {
  try {
    if (!userQuery) throw new Error("Data is invalid");
    let topMatch = await findBestMatch(userQuery);
    let response;
    let bestMatch = topMatch[0];

    // console.log("topMatch1", topMatch);

    if (bestMatch.score > 0.9) {
      response = generateBestMatch(userQuery, bestMatch.match, userIP);
    } else {
      const newQuery = await generateNewQuery(userQuery, topMatch);
      // const newQuery = "Null";
      topMatch = await findBestMatch(newQuery);
      // console.log("topMatch2", topMatch);

      bestMatch = topMatch.reduce(
        (max, item) => (item.score > max.score ? item : max),
        { match: "", score: -Infinity }
      );
      if (bestMatch.score > 0.9) {
        response = generateBestMatch(userQuery, bestMatch.match, userIP);
      } else {
        response = await generateGpt4Response(userQuery, topMatch, userIP);
      }
    }
    return response;
  } catch (error) {
    // console.log(error);
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
