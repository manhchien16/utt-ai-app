const {
  areObjectValid,
  cosineSimilarity,
  generateNewQuery,
} = require("../../common/functionCommon");
const faqCollection = require("../models/faqtuyensinh");
const chatlogCollection = require("../models/chatlog");
const { OpenAI } = require("openai");
const mammoth = require("mammoth");
const fs = require("fs-extra");
require("dotenv").config();
require("@tensorflow/tfjs-node");

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

    // console.log(
    //   "🔹 Top 5 Match:",
    //   topMatch.slice(0, Math.min(5, topMatch.length))
    // );

    return topMatch.slice(0, Math.min(5, topMatch.length));
  } catch (error) {
    throw new Error(error.message);
  }
};
// const findBestMatch = async (userQuery) => {
//   try {
//     if (!userQuery) throw new Error("Data is invalid");

//     // Lấy danh sách câu hỏi từ MongoDB
//     const faqData = await faqCollection.find({}, "-_id Question").lean();
//     const faqQuestions = faqData.map((doc) => doc.Question);

//     // Lấy dữ liệu từ singleton hoặc nơi lưu trữ
//     const { encoder, faissIndex, faqEmbeddings } = getSearchData();
//     if (!faqEmbeddings) {
//       throw new Error("faqEmbeddings không được khởi tạo.");
//     }

//     const faqItem = "Khi nào có giấy báo trúng tuyển";
//     const userInput = "Khi nào có giấy báo trúng tuyển";

//     const item1 = await encoder([faqItem]); // Encode riêng
//     const item2 = await encoder([userInput, faqItem]); // Encode chung

//     console.log("Embedding for faqItem (single):", item1.data);

//     // Lấy embedding của câu thứ hai trong `item2`
//     const dims = item2.dims[2]; // Kích thước của mỗi embedding vector
//     const clsVector = item2.data.slice(dims, dims * 2); // Lấy vector [CLS] của câu thứ hai

//     console.log("Embedding for faqItem (from batch):", clsVector);

//     // cosineSimilarity(item1.data, clsVectorAtIndex122);

//     // console.log("query", [userQuery]);

//     const queryEmbeddings = await encoder([userQuery]);
//     const embeddingsData = queryEmbeddings.data;

//     // Kích thước của embedding
//     const numSentences = queryEmbeddings.dims[0]; // Số lượng câu truy vấn
//     const embeddingSize = queryEmbeddings.dims[2]; // Kích thước embedding cho mỗi câu

//     // Mảng chứa tất cả các embedding [CLS] của các câu truy vấn
//     const processedQueryEmbeddings = new Float32Array(
//       numSentences * embeddingSize
//     );

//     for (let i = 0; i < numSentences; i++) {
//       // Tính toán chỉ mục bắt đầu của embedding [CLS] cho câu truy vấn i
//       const clsEmbeddingStartIndex =
//         i * (queryEmbeddings.dims[1] * embeddingSize); // Dòng * số token * kích thước embedding
//       const clsEmbedding = embeddingsData.slice(
//         clsEmbeddingStartIndex,
//         clsEmbeddingStartIndex + embeddingSize
//       );

//       // Lưu embedding [CLS] của câu truy vấn vào mảng processedQueryEmbeddings
//       for (let j = 0; j < embeddingSize; j++) {
//         processedQueryEmbeddings[i * embeddingSize + j] = clsEmbedding[j];
//       }
//     }

//     const queryArrayNormal = Array.from(processedQueryEmbeddings);

//     const { labels, distances } = faissIndex.search(queryArrayNormal, 3);

//     // const converQueryArray = Array.from(new Float32Array(queryArray));
//     // console.log(queryArray);
//     // console.log("labels[0]", labels[0]);
//     // console.log("faqEmbeddingsArray", faqEmbeddingsArray);
//     // console.log(
//     //   "faqEmbeddingsArray with labels",
//     //   faqEmbeddingsArray[labels[0]]
//     // );

//     // console.log("Shape of faqEmbeddingsArray:", faqEmbeddingsArray.shape);

//     // console.log(labels[0]);

//     // Tính toán chỉ số bắt đầu của vector thứ 122 trong mảng
//     // const faqEmbeddingsArray = faqEmbeddings;
//     // const index = 122;
//     // const startIndex = index * embeddingSize;
//     // // Trích xuất vector [CLS] tại vị trí 122
//     // let clsVectorAtIndex122 = faqEmbeddingsArray.slice(
//     //   startIndex,
//     //   startIndex + embeddingSize
//     // );

//     // In ra vector đã trích xuất
//     // console.log(queryArrayNormal);
//     // console.log(clsVectorAtIndex122);

//     // console.log(
//     //   "cosin",
//     //   cosineSimilarity(queryArrayNormal, Array.from(clsVectorAtIndex122))
//     // );

//     const topMatch = labels.map((item, index) => ({
//       match: faqQuestions[item],
//       score: 0,
//     }));

//     console.log("topmatch", topMatch);

//     // return {
//     //   match: faqQuestions[bestMatchIndex],
//     //   score: bestMatchScore, // Độ tương đồng
//     // };
//   } catch (error) {
//     console.log(error);

//     throw new Error(error.message);
//   }
// };

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
const generateGpt4Response = async (data, userIP) => {
  try {
    // if (typeof userQuery !== "string" || !userQuery)
    //   throw new Error("Data is invalid");
    if (areObjectValid(["match"], data)) {
    }
    console.log(data);

    const additionalData = await Promise.all(
      data.data.map(async (item) => {
        const answer = await faqCollection.findOne({ Question: item.match });
        return answer.Answer;
      })
    );
    const contextInfo =
      additionalData.length > 0
        ? `\n\nThông tin tham khảo:\n${additionalData.join("\n")}`
        : "";

    const prompt = `Một sinh viên hỏi: ${data.userQuery}\n\nDựa trên thông tin tìm được trên internet và dữ liệu có sẵn, hãy cung cấp một câu trả lời hữu ích, ngắn gọn và thân thiện. Dẫn nguồn nếu có thể.${contextInfo}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "Bạn là một trợ lý tuyển sinh trường đại học Công Nghệ Giao Thông Vận Tải (UTT) hữu ích.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 3500,
    });

    const newData = {
      user_ip: userIP,
      timestamp: new Date(),
      user_message: data.userQuery,
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

//generateBestMatch
const generateBestMatch = async (userQuery, question, userIP) => {
  const responseFaq = await faqCollection.findOne({
    Question: question,
  });

  const newData = {
    user_ip: userIP,
    timestamp: new Date(),
    user_message: userQuery,
    bot_response: responseFaq.Answer,
  };
  return await saveChatLog(newData);
};

// Handle user query
const handleUserQuery = async (userQuery, userIP) => {
  try {
    if (!userQuery) throw new Error("Data is invalid");
    const topMatch = await findBestMatch(userQuery);
    let response;
    const bestMatch = topMatch[0];

    if (bestMatch.score > 0.86) {
      response = generateBestMatch(userQuery, bestMatch.match, userIP);
    } else {
      const newQuery = generateNewQuery(userQuery);
      const topMatch = await findBestMatch(newQuery);
      const bestMatch = topMatch.reduce(
        (max, item) => (item.score > max.score ? item : max),
        { match: "", score: -Infinity }
      );
      if (bestMatch > 0.86) {
        response = generateBestMatch(userQuery, bestMatch.match, userIP);
      } else {
        response = topMatch;
      }
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
