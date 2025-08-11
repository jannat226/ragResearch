// server/utils/chunk.js
// Simple text chunker by characters with overlap.
// Adjust sizes as needed.
function chunkText(text, chunkSize = 2000, overlap = 200) {
  const t = String(text || "");
  if (t.length === 0) return [];
  const chunks = [];
  let start = 0;
  while (start < t.length) {
    const end = Math.min(start + chunkSize, t.length);
    const piece = t.slice(start, end);
    chunks.push(piece);
    if (end === t.length) break;
    start = end - overlap; // move back by overlap
    if (start < 0) start = 0;
  }
  return chunks;
}

module.exports = { chunkText };
