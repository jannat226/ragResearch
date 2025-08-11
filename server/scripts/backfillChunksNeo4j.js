// server/scripts/backfillChunksNeo4j.js
require("dotenv").config();
const mongoose = require("mongoose");
const Blog = require("../models/Blog");
const { embedText } = require("../utils/embeddings");
const { dbSession } = require("../utils/neo4j");
const { chunkText } = require("../utils/chunk");

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const session = dbSession("WRITE");

    const blogs = await Blog.find();
    console.log(`Chunk backfill: processing ${blogs.length} blogs...`);

    for (const blog of blogs) {
      const id = blog._id.toString();
      const text = `${blog.title || ""}\n\n${blog.content || ""}`;
      const blogEmbedding = await embedText(text);

      // Ensure BlogVec
      await session.run(
        `MERGE (b:BlogVec {blogId: $id})
         SET b.title = $title,
             b.createdAt = datetime($createdAt),
             b.embedding = $embedding`,
        {
          id,
          title: blog.title,
          createdAt: blog.createdAt.toISOString(),
          embedding: blogEmbedding,
        }
      );

      // Remove old chunks
      await session.run(`MATCH (c:Chunk {blogId: $id}) DETACH DELETE c`, {
        id,
      });

      // Create chunks
      const chunks = chunkText(text);
      let idx = 0;
      for (const c of chunks) {
        const ce = await embedText(c);
        await session.run(
          `MERGE (ch:Chunk {blogId: $id, chunkIndex: $idx})
           SET ch.text = $text, ch.embedding = $embedding
           WITH ch
           MATCH (b:BlogVec {blogId: $id})
           MERGE (ch)-[:CHUNK_OF]->(b)`,
          { id, idx, text: c, embedding: ce }
        );
        idx += 1;
      }
      console.log(`Indexed blog ${id} with ${idx} chunks`);
    }

    await session.close();
    console.log("Chunk backfill complete");
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
