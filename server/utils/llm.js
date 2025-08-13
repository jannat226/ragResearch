// server/utils/llm.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

let model;
function getGeminiModel() {
  const key = process.env.GOOGLE_API_KEY;
  if (!key) throw new Error("Missing GOOGLE_API_KEY in .env");
  if (!model) {
    const genAI = new GoogleGenerativeAI(key);
    // Fast, low-cost general model; switch to 'gemini-1.5-pro' if needed
    model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }
  return model;
}

async function answerWithContext(question, contexts) {
  const model = getGeminiModel();

  // Check if we have any meaningful contexts
  if (
    !contexts ||
    contexts.length === 0 ||
    !contexts.some((c) => c.text && c.text.trim())
  ) {
    return {
      answer:
        "I don't have any relevant blog content to answer this question yet.",
      usedContexts: [],
    };
  }

  // Limit total context length
  const maxChars = 12000;
  let used = 0;
  const chosen = [];
  for (const c of contexts) {
    const snippet = c.text || "";
    if (!snippet.trim()) continue; // Skip empty contexts
    if (used + snippet.length > maxChars) break;
    chosen.push(c);
    used += snippet.length;
  }

  // If no good contexts after filtering
  if (chosen.length === 0) {
    return {
      answer:
        "I don't have any relevant blog content to answer this question yet.",
      usedContexts: [],
    };
  }

  const contextText = chosen
    .map((c, index) => `${index + 1}. ${c.text}`)
    .join("\n");

  const prompt = `You are a helpful assistant for a blog website. Answer the question using ONLY the provided context. If the answer is not in the context, say you don't know.
Provide a clear, comprehensive answer without including any internal references or IDs in your response.

QUESTION: ${question}

CONTEXT:\n${contextText}`;

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });
  const answer = result?.response?.text?.() || "";
  return { answer, usedContexts: chosen };
}

module.exports = { getGeminiModel, answerWithContext };
