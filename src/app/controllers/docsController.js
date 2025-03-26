const docsService = require("../services/docsService");
const path = require("path");
const DOC_PATH = "../../docs/ttc_ts25.docx";
const docPath = path.resolve(__dirname, DOC_PATH);

const getDocument = async (req, res) => {
  try {
    const result = await docsService.getDocument();
    res.status(200).json({ data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const writeDocument = async (req, res) => {
  try {
    const newText = req.body.newText;
    const result = await docsService.writeDocument(newText);
    res.status(200).json({ data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const downloadDocFile = async (req, res) => {
  try {
    res.download(docPath);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getDocument, writeDocument, downloadDocFile };
