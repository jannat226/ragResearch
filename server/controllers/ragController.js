// server/controllers/ragController.js
const Blog = require("../models/Blog");
const { embedText } = require("../utils/embeddings");
const { getDriver, dbSession } = require("../utils/neo4j");
const { answerWithContext } = require("../utils/llm");

// GET /api/search?q=...&k=10
exports.search = async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    const k = Math.min(parseInt(req.query.k || "10", 10), 50);
    if (!q) return res.status(400).json({ message: "Query q is required" });

    const embedding = await embedText(q);
    const session = dbSession("READ");
    const result = await session.run(
      `CALL db.index.vector.queryNodes('blog_embedding', $k, $embedding)
       YIELD node, score
       RETURN node.blogId AS blogId, score
       ORDER BY score ASC`,
      { k, embedding }
    );
    await session.close();

    const ids = result.records.map((r) => r.get("blogId"));
    const scores = Object.fromEntries(
      result.records.map((r) => [r.get("blogId"), r.get("score")])
    );

    const blogs = await Blog.find({ _id: { $in: ids } })
      .populate("author", "username email")
      .sort({ createdAt: -1 });

    const ordered = ids
      .map((id) => blogs.find((b) => b._id.toString() === id))
      .filter(Boolean)
      .map((b) => ({ ...b.toObject(), _score: scores[b._id.toString()] }));

    res.json(ordered);
  } catch (e) {
    console.error("Search failed:", e);
    res.status(500).json({ message: "Search failed" });
  }
};

// GET /api/blogs/:id/related?k=5
exports.related = async (req, res) => {
  try {
    const { id } = req.params;
    const k = Math.min(parseInt(req.query.k || "5", 10), 20);

    const session = dbSession("READ");
    const check = await session.run(
      `MATCH (b:BlogVec {blogId: $id}) RETURN b.blogId AS blogId`,
      { id }
    );

    let embedding;
    if (check.records.length === 0) {
      const blog = await Blog.findById(id);
      if (!blog) return res.status(404).json({ message: "Blog not found" });
      const text = `${blog.title || ""}\n\n${blog.content || ""}`;
      embedding = await embedText(text);
    }

    const result = await session.run(
      check.records.length
        ? `MATCH (b:BlogVec {blogId: $id})
           CALL db.index.vector.queryNodes('blog_embedding', $kPlusOne, b.embedding)
           YIELD node, score
           WHERE node.blogId <> $id
           RETURN node.blogId AS blogId, score
           ORDER BY score ASC`
        : `CALL db.index.vector.queryNodes('blog_embedding', $kPlusOne, $embedding)
           YIELD node, score
           RETURN node.blogId AS blogId, score
           ORDER BY score ASC`,
      { id, kPlusOne: k + 1, embedding }
    );
    await session.close();

    const ids = result.records
      .map((r) => r.get("blogId"))
      .filter((bid) => bid !== id)
      .slice(0, k);
    const scores = Object.fromEntries(
      result.records.map((r) => [r.get("blogId"), r.get("score")])
    );

    const blogs = await Blog.find({ _id: { $in: ids } }).populate(
      "author",
      "username email"
    );

    const ordered = ids
      .map((blogId) => blogs.find((b) => b._id.toString() === blogId))
      .filter(Boolean)
      .map((b) => ({ ...b.toObject(), _score: scores[b._id.toString()] }));

    res.json(ordered);
  } catch (e) {
    console.error("Related failed:", e);
    res.status(500).json({ message: "Related failed" });
  }
};

// POST /api/ask { question, blogId?, k? }
exports.ask = async (req, res) => {
  try {
    const question = (req.body.question || "").trim();
    const blogId = req.body.blogId;
    const k = Math.min(parseInt(req.body.k || "6", 10), 20);
    if (!question)
      return res.status(400).json({ message: "question is required" });

    const embedding = await embedText(question);
    const session = dbSession("READ");

    const query = blogId
      ? `MATCH (b:BlogVec {blogId: $blogId})<-[:CHUNK_OF]-(c:Chunk)
         WITH collect(c) AS chunks
         CALL db.index.vector.queryNodes('chunk_embedding', $k, $embedding)
         YIELD node, score
         WHERE node IN chunks
         RETURN node { .blogId, .chunkIndex, .text } AS chunk, score
         ORDER BY score ASC`
      : `CALL db.index.vector.queryNodes('chunk_embedding', $k, $embedding)
         YIELD node, score
         RETURN node { .blogId, .chunkIndex, .text } AS chunk, score
         ORDER BY score ASC`;

    const result = await session.run(query, { k, embedding, blogId });
    await session.close();

    const contexts = result.records.map((r) => ({
      ...r.get("chunk"),
      score: r.get("score"),
    }));

    const { answer, usedContexts } = await answerWithContext(
      question,
      contexts
    );

    // If asking from a specific blog page, return only the answer (no citations)
    if (blogId) {
      return res.json({ answer });
    }

    // Sitewide ask: return sources with blog titles
    const ids = Array.from(new Set(usedContexts.map((c) => c.blogId)));
    const metas = await Blog.find({ _id: { $in: ids } }, { title: 1 });
    const titleMap = Object.fromEntries(
      metas.map((m) => [m._id.toString(), m.title])
    );
    const sources = ids.map((id) => ({
      blogId: id,
      title: titleMap[id] || "Untitled",
    }));

    res.json({ answer, sources });
  } catch (e) {
    console.error("Ask failed:", e);
    res.status(500).json({ message: "Ask failed" });
  }
};
