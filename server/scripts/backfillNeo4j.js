// server/scripts/backfillNeo4j.js
require("dotenv").config();
const mongoose = require("mongoose");
const Blog = require("../models/Blog");
const { embedText } = require("../utils/embeddings");
const { getDriver } = require("../utils/neo4j");

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const session = getDriver().session({ defaultAccessMode: "WRITE" });

    const blogs = await Blog.find();
    console.log(`Indexing ${blogs.length} blogs to Neo4j ...`);

    for (const blog of blogs) {
      const text = `${blog.title || ""}\n\n${blog.content || ""}`;
      const embedding = await embedText(text);
      await session.run(
        `MERGE (b:BlogVec {blogId: $id})
         SET b.title = $title,
             b.createdAt = datetime($createdAt),
             b.embedding = $embedding`,
        {
          id: blog._id.toString(),
          title: blog.title,
          createdAt: blog.createdAt.toISOString(),
          embedding,
        }
      );
    }

    await session.close();
    console.log("Done");
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
