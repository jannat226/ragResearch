// server/utils/embeddings.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

let model;
function getModel() {
  const key = process.env.GOOGLE_API_KEY;
  if (!key) throw new Error("Missing GOOGLE_API_KEY in .env");
  if (!model) {
    const genAI = new GoogleGenerativeAI(key);
    model = genAI.getGenerativeModel({ model: "text-embedding-004" });
  }
  return model;
}

async function embedText(text) {
  const input = (text || "").slice(0, 100000);
  const res = await getModel().embedContent(input);
  // returns { embedding: { values: number[] } }
  return res.embedding.values;
}

module.exports = { embedText };
