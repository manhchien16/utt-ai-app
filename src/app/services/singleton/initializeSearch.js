const faqCollection = require("../../models/faqtuyensinh");
const faiss = require("faiss-node");
require("dotenv").config();
const use = require("@tensorflow-models/universal-sentence-encoder");

let encoder = null;
let faissIndex = null;
let faqEmbeddings = null;
let initialized = false;

const initializeSearch = async () => {
  if (initialized) return { encoder, faissIndex, faqEmbeddings };

  let attempt = 0;
  const maxAttempts = 3;

  while (attempt < maxAttempts) {
    try {
      // console.log(`🔄 Attempt ${attempt + 1}: Loading model USE...`);
      encoder = await use.load();
      // console.log("✅ Model USE already!");

      const faqData = await faqCollection.find({}, "-_id");
      if (!faqData.length) {
        // console.log("❌ No data FAQ.");
        initialized = true;
        return null;
      }

      const faqQuestions = faqData.map((item) => item.Question);
      faqEmbeddings = await encoder.embed(faqQuestions);

      // console.log(faqEmbeddings.shape);
      // console.log(faqEmbeddings.arraySync().flat().length);

      faissIndex = new faiss.IndexFlatL2(faqEmbeddings.shape[1]);
      faissIndex.add(Array.from(faqEmbeddings.arraySync().flat()));

      initialized = true;
      return { encoder, faissIndex, faqEmbeddings };
    } catch (error) {
      attempt++;
      if (attempt >= maxAttempts) {
        throw new Error(
          "🚨 Maximum retry attempts reached. Failed to initialize."
        );
      }
      throw new Error(`❌ Error initializeSearch (Attempt ${attempt}):`, error);
    }
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
