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
const { STOP_WORDS } = require("../../common/constanCommon");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// findBestMatch in FAQ
const findBestMatch = async (userQuery) => {
  try {
    const { encoder, faissIndex, faqEmbeddings } = getSearchData();
    if (!userQuery || !encoder || !faissIndex || !faqEmbeddings)
      throw new Error("Data is invalid");

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
const searchInDocument = async (userQuery, UserIp) => {
  try {
    const { encoder, faissIndexDoc, chuck } = getSearchData();
    if (
      !areObjectValid(["userQuery"], { userQuery }) ||
      !encoder ||
      !faissIndexDoc ||
      !chuck
    )
      throw new Error("Data is invalid");

    const convertQuery = [userQuery];
    const queryEmbedding = await encoder(convertQuery, { pooling: "mean" });

    const { labels } = faissIndexDoc.search(Array.from(queryEmbedding.data), 1);

    const filteredText = convertQuery[0].toLowerCase();
    // .split(" ")
    // .filter((word) => !STOP_WORDS.has(word.toLowerCase()))
    // .join(" ");

    const filterDoc = chuck.filter((doc) => doc.includes(filteredText));

    const extractContext = (doc, matchText, windowSize = 150) => {
      const words = doc.split(" ");
      const matchIdx = doc.indexOf(matchText);

      if (matchIdx === -1) return null;

      const word_idx = doc.slice(0, matchIdx).split(" ").length;

      const start_idx = Math.max(0, word_idx - 10);
      const end_idx = Math.min(words.length, word_idx + 140);

      return words.slice(start_idx, end_idx).join(" ");
    };

    const extractedTexts = filterDoc.map((doc) =>
      extractContext(doc, filteredText)
    );

    const resultFindByFaiss = chuck[labels[0]];

    const convertExtractedTexts = extractedTexts.join(" ");

    // Chia nội dung thành từng câu để so sánh
    const sentences1 = convertExtractedTexts.split(". ");
    const sentences2 = resultFindByFaiss.split(". ");

    // Tìm các câu trùng nhau
    const commonSentences = sentences1.filter((sentence) =>
      sentences2.includes(sentence)
    );

    let result;

    if (commonSentences.length > 2) {
      result = resultFindByFaiss;
    } else {
      result = convertExtractedTexts + "," + resultFindByFaiss;
    }

    return generateGpt4Response(userQuery, result, UserIp);
  } catch (error) {
    console.log(error);
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
    if (!isValid || !data) {
      throw new Error("Data is invalid");
    }

    const contextInfo = `đây là bộ dữ liệu cung cấp: ${data}`;

    const prompt = `Một sinh viên hỏi: ${userQuery}\n\nDựa trên thông tin tìm được trên dữ liệu đã được cung cấp, hãy cung cấp một câu trả lời hữu ích, ngắn gọn, xuống dòng không bị cách quá xa và thân thiện.${contextInfo}`;

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
      bot_response: `${response.choices[0].message.content} \n\n**Tôi là một trợ lý Ai nên câu trả lời có thể chưa đầy đủ bạn có thể truy cập trực liếp vào https://utt.edu.vn/ để biết thêm!**`,
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
        response = searchInDocument(userQuery, userIP);
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
