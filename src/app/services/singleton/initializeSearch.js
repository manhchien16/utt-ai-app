const faqCollection = require("../../models/faqtuyensinh");
const faiss = require("faiss-node");
require("dotenv").config();
const use = require("@tensorflow-models/universal-sentence-encoder");

let encoder = null;
let faissIndex = null;
let faqEmbeddings = null;
let initialized = false;

// load model USE and faissIndex
const initializeSearch = async () => {
  if (initialized) return { encoder, faissIndex, faqEmbeddings };

  try {
    console.log("🔄 Loading model USE...");
    encoder = await use.load();
    console.log("✅ Model USE already!");

    const faqData = await faqCollection.find({}, "-_id");
    if (!faqData.length) {
      console.log("❌ No data FAQ.");
      initialized = true;
      return null;
    }

    const faqQuestions = faqData.map((item) => item.Question);
    faqEmbeddings = await encoder.embed(faqQuestions);

    console.log(faqEmbeddings.shape);
    console.log(faqEmbeddings.arraySync().flat().length);

    faissIndex = new faiss.IndexFlatL2(faqEmbeddings.shape[1]);
    faissIndex.add(Array.from(faqEmbeddings.arraySync().flat()));

    initialized = true;
    return { encoder, faissIndex, faqEmbeddings };
  } catch (error) {
    console.error("❌ Error initializeSearch:", error);
    return null;
  }
};

// get model USE and faissIndex
const getSearchData = () => {
  if (!initialized) {
    throw new Error("🚨 initializeSearch not already!");
  }
  return { encoder, faissIndex, faqEmbeddings };
};

module.exports = { initializeSearch, getSearchData };
