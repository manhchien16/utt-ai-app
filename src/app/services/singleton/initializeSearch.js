const faqCollection = require("../../models/faqtuyensinh");
const faiss = require("faiss-node");
const mammoth = require("mammoth");
require("dotenv").config();
const path = require("path");
const fs = require("fs");
const { DOC_PATH } = require("../../../common/constanCommon");
const { splitTextIntoChunks } = require("../../../common/functionCommon");

let encoder = null;
let faissIndex = null;
let faissIndexDoc = null;
let chuck = null;
let faqEmbeddings = null;
let initialized = false;

const loadPipeline = async () => {
  const { pipeline } = await import("@xenova/transformers");
  const model = await pipeline(
    "feature-extraction",
    "Xenova/all-mpnet-base-v2"
  );
  encoder = model;
  console.log("✅ SBERT model loaded!");
};

const initializeSearchDoc = async () => {
  try {
    const docPath = path.resolve(__dirname, DOC_PATH);
    const docFiles = fs
      .readdirSync(docPath)
      .filter((file) => file.endsWith(".docx"));

    if (docFiles?.length === 0) {
      throw new Error("docx not already!");
    }

    let allText = "";
    for (const file of docFiles) {
      const filePath = path.join(docPath, file);
      const { value: text } = await mammoth.extractRawText({ path: filePath });
      allText += text.toLowerCase() + "\n";
    }

    chuck = splitTextIntoChunks(allText);
    const docEmbedings = await encoder(chuck, { pooling: "mean" });
    faissIndexDoc = new faiss.IndexFlatL2(docEmbedings.dims[1]);
    faissIndexDoc.add(Array.from(docEmbedings.data));

    console.log(
      "✅ Thêm docs embeddings vào FAISS thành công!",
      faissIndexDoc.ntotal()
    );
  } catch (error) {
    console.log(error);
  }
};

const initializeSearch = async () => {
  try {
    // Load model SBERT
    if (!encoder) throw new Error("🚨 Lỗi tải mô hình SBERT.");
    // get data FAQ từ MongoDB
    const faqData = await faqCollection.find({}, "-_id");

    if (!faqData || faqData.length === 0)
      return { encoder, faissIndex, faqEmbeddings };
    // query FAQ
    const faqQuestions = faqData.map((item) => item.Question);
    faqEmbeddings = await Promise.all(
      faqQuestions.map(async (q) => {
        const embedding = await encoder(q, { pooling: "mean" });
        return embedding.tolist()[0];
      })
    );
    const dim = faqEmbeddings[0].length || 0;
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
  return { encoder, faissIndex, faqEmbeddings, faissIndexDoc, chuck };
};

module.exports = {
  initializeSearch,
  getSearchData,
  initializeSearchDoc,
  loadPipeline,
};
