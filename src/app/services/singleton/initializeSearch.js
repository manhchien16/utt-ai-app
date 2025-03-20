const { log } = require("@tensorflow/tfjs");
const faqCollection = require("../../models/faqtuyensinh");
const faiss = require("faiss-node");
require("dotenv").config();

let encoder = null;
let faissIndex = null;
let faqEmbeddings = null;
let initialized = false;
let pipeline = null;

const loadPipeline = async () => {
  const { pipeline } = await import("@xenova/transformers");
  const model = await pipeline(
    "feature-extraction",
    "Xenova/all-mpnet-base-v2",
    { local_files_only: true }
  );
  return model;
};

function cosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));

  return dotProduct / (magnitudeA * magnitudeB);
}

const initializeSearchs = async () => {
  const extractor = await loadPipeline();

  // Lấy dữ liệu FAQ từ MongoDB
  const faqData = await faqCollection.find({}, "-_id");

  // Trích xuất câu hỏi từ dữ liệu FAQ
  const questions = faqData.map((item) => item.Question);

  // const questions = [
  //   "Khi nao co giay bao truong utt",
  //   "khi nao co giay bao trung tuyen",
  //   "địa chỉ là",
  // ];

  const userQuestion = ["Khi nào có giấy báo trúng tuyển"];

  const faqEmbeddings = await Promise.all(
    questions.map(async (q) => {
      const embedding = await extractor(q, { pooling: "mean" });
      return embedding.tolist()[0];
    })
  );
  const userEmbedding = await Promise.all(
    userQuestion.map(async (q) => {
      const embedding = await extractor(q, { pooling: "mean" });
      return embedding.tolist()[0];
    })
  );
  console.log(faqEmbeddings[0]);
  console.log(userEmbedding[0]);

  if (JSON.stringify(faqEmbeddings[0]) === JSON.stringify(userEmbedding[0])) {
    console.log("Giống nhau");
  } else {
    console.log("Không giống");
  }

  const diffs = faqEmbeddings[0].map((val, idx) =>
    Math.abs(val - userEmbedding[0][idx])
  );
  console.log("Max difference:", Math.max(...diffs));
  console.log(
    "Average difference:",
    diffs.reduce((a, b) => a + b, 0) / diffs.length
  );

  let similarities = cosineSimilarity(
    Array.from(faqEmbeddings[0]),
    Array.from(userEmbedding[0])
  );
  console.log("similarities", similarities);

  // const userEmbeddingList = userEmbedding.tolist()[0];

  // Tính cosine similarity và lưu kết quả vào mảng
  // let similarities = questions.map((q, i) => ({
  //   question: q,
  //   score: cosineSimilarity(
  //     Array.from(userEmbedding[0]),
  //     Array.from(faqEmbeddings[i])
  //   ),
  // }));
  // Sắp xếp theo độ tương đồng giảm dần
  // similarities.sort((a, b) => b.score - a.score);

  // Lấy ra 3 câu có độ tương đồng cao nhất
  // console.log("Top 3 câu hỏi gần nhất:");
  // console.log(similarities.slice(0, 3));
};

//-----
const initializeSearch = async () => {
  // Load mô hình SBERT
  encoder = await loadPipeline();
  if (!encoder) throw new Error("🚨 Lỗi tải mô hình SBERT.");
  console.log("✅ SBERT model loaded!");

  // Lấy dữ liệu FAQ từ MongoDB
  const faqData = await faqCollection.find({}, "-_id");

  // Trích xuất câu hỏi từ dữ liệu FAQ
  const faqQuestions = faqData.map((item) => item.Question);

  faqEmbeddings = await Promise.all(
    faqQuestions.map(async (q) => {
      const embedding = await encoder(q, { pooling: "mean" });
      return embedding.tolist()[0];
    })
  );
  const dim = faqEmbeddings[0].length;

  const flatEmbeddings = Array.from(new Float32Array(faqEmbeddings.flat()));

  // Create FAISS Index
  faissIndex = new faiss.IndexFlatL2(dim);
  faissIndex.add(flatEmbeddings);
  console.log("✅ Thêm embeddings vào FAISS thành công!", faissIndex.ntotal());

  initialized = true;
  return { encoder, faissIndex, faqEmbeddings };
};

const getSearchData = () => {
  if (!initialized) {
    throw new Error("🚨 initializeSearch not already!");
  }
  return { encoder, faissIndex, faqEmbeddings };
};

module.exports = { initializeSearch, getSearchData, initializeSearchs };
