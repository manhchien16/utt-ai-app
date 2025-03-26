const path = require("path");
const DOC_PATH = "../../docs/ttc_ts25.docx";
const mammoth = require("mammoth");
const fs = require("fs-extra");
const docPath = path.resolve(__dirname, DOC_PATH);

const getDocument = async () => {
  try {
    const { value: dataDoc } = await mammoth.extractRawText({ path: docPath });
    return dataDoc;
  } catch (error) {
    throw new Error(error.message);
  }
};

const writeDocument = async (newText) => {
  try {
    if (!newText) throw new Error("Data is invalid");

    const oldDocs = await getDocument();
    if (oldDocs.trim() === newText.trim()) return "No changes made.";

    await fs.writeFile(docPath, newText, "utf-8");

    return getDocument();
  } catch (error) {
    throw new Error(error.message);
  }
};

const importDocFile = async () => {};

module.exports = { getDocument, writeDocument };
