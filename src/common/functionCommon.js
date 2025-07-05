const { QUERY_KEYWORD } = require("./constanCommon");
const XRegExp = require("xregexp");

const areObjectValid = (keys, queryParams) => {
  return keys.every((key) => {
    const value = queryParams?.[key];
    return typeof value === "string" && value.trim().length > 0;
  });
};

const cosineSimilarity = (vecA, vecB) => {
  const dotProduct = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));

  return dotProduct / (magnitudeA * magnitudeB);
};

const splitTextIntoChunks = (text, chunkSize = 512, overlap = 128) => {
  const words = text.split(/\s+/);
  const chunks = [];

  for (let i = 0; i < words.length; i += chunkSize - overlap) {
    const chunk = words.slice(i, i + chunkSize).join(" ");
    chunks.push(chunk);
  }
  return chunks;
};

const pagination = (page, pageSize, totalItem) => {
  page = parseInt(page) || 1;
  pageSize = parseInt(pageSize) || 10;

  return {
    page,
    pageSize,
    totalItem,
    totalPages: Math.ceil(totalItem / pageSize),
  };
};

const SAFE_REGEX = XRegExp("^[\\p{L}\\p{N}\\s.,!?\"'“”‘’\\-–—()\\[\\]{}:;]*$");

function shannonEntropy(s) {
  const counts = {};
  for (const char of s) {
    counts[char] = (counts[char] || 0) + 1;
  }
  const len = s.length;
  let entropy = 0;
  for (const count of Object.values(counts)) {
    const p = count / len;
    entropy -= p * Math.log2(p);
  }
  return entropy;
}

function symbolRatio(s) {
  if (s.length === 0) return 0;
  let unsafeCount = 0;
  for (const ch of s) {
    if (!SAFE_REGEX.test(ch)) {
      unsafeCount++;
    }
  }
  return unsafeCount / s.length;
}

function looksGibberish(s, H_thresh = 4.8, sym_thresh = 0.3) {
  const entropy = shannonEntropy(s);
  const ratio = symbolRatio(s);
  // console.log(
  //   `[debug] entropy=${entropy.toFixed(2)} ratio=${ratio.toFixed(2)}`
  // );
  return entropy > H_thresh || ratio > sym_thresh;
}

function isValidData(text, minLen = 2) {
  if (!text || text.trim().length < minLen) return false;
  return !looksGibberish(text);
}

module.exports = {
  areObjectValid,
  cosineSimilarity,
  splitTextIntoChunks,
  pagination,
  isValidData,
};
