const { QUERY_KEYWORD } = require("./constanCommon");

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

module.exports = { areObjectValid, cosineSimilarity, splitTextIntoChunks };
