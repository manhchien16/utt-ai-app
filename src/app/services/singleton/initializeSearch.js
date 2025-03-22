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
    "Xenova/all-mpnet-base-v2"
  );
  return model;
};

const initializeSearch = async () => {
  try {
    // Load model SBERT
    encoder = await loadPipeline();
    if (!encoder) throw new Error("🚨 Lỗi tải mô hình SBERT.");
    console.log("✅ SBERT model loaded!");

    // get data FAQ từ MongoDB
    const faqData = await faqCollection.find({}, "-_id");

    // query FAQ
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
    console.log(
      "✅ Thêm embeddings vào FAISS thành công!",
      faissIndex.ntotal()
    );

    initialized = true;
    return { encoder, faissIndex, faqEmbeddings };
  } catch (error) {
    throw new Error(error.message);
  }
};

const getSearchData = () => {
  if (!initialized) {
    throw new Error("🚨 initializeSearch not already!");
  }
  return { encoder, faissIndex, faqEmbeddings };
};

module.exports = { initializeSearch, getSearchData };
