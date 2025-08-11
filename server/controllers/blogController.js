// server/controllers/blogController.js
const Blog = require("../models/Blog");
const { embedText } = require("../utils/embeddings");
const { getDriver, dbSession } = require("../utils/neo4j");
const { chunkText } = require("../utils/chunk");

// Create a new blog post
exports.createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;
    const author = req.user.id;
    let image = "";
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    } else if (req.body.image) {
      image = req.body.image;
    }
    const blog = new Blog({ title, content, image, author });
    await blog.save();

    // RAG: upsert BlogVec in Neo4j with embedding
    try {
      const text = `${title || ""}\n\n${content || ""}`;
      const embedding = await embedText(text);
      const session = dbSession("WRITE");
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

      // upsert chunks
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
          { id: blog._id.toString(), idx, text: c, embedding: ce }
        );
        idx += 1;
      }
      await session.close();
    } catch (e) {
      console.error("Failed to index blog/chunks in Neo4j:", e.message);
    }

    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all blog posts
exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("author", "username email")
      .sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single blog post by ID
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate("author", "username email bio")
      .populate("comments.author", "username email")
      .populate("likes", "username email");
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a blog post
exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { title, content } = req.body;
    let image = blog.image; // Keep existing image by default

    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    } else if (req.body.image) {
      image = req.body.image;
    }

    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.image = image;
    blog.updatedAt = Date.now();
    await blog.save();

    // RAG: update BlogVec embedding + chunks
    try {
      const text = `${blog.title || ""}\n\n${blog.content || ""}`;
      const embedding = await embedText(text);
      const session = dbSession("WRITE");
      await session.run(
        `MERGE (b:BlogVec {blogId: $id})
         SET b.title = $title,
             b.updatedAt = datetime($updatedAt),
             b.embedding = $embedding`,
        {
          id: blog._id.toString(),
          title: blog.title,
          updatedAt: new Date().toISOString(),
          embedding,
        }
      );

      // Remove existing chunks
      await session.run(`MATCH (c:Chunk {blogId: $id}) DETACH DELETE c`, {
        id: blog._id.toString(),
      });
      // Recreate chunks
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
          { id: blog._id.toString(), idx, text: c, embedding: ce }
        );
        idx += 1;
      }
      await session.close();
    } catch (e) {
      console.error("Failed to update blog/chunks in Neo4j:", e.message);
    }

    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a blog post
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    await Blog.findByIdAndDelete(req.params.id);

    // RAG: remove from Neo4j (blog + chunks)
    try {
      const session = dbSession("WRITE");
      await session.run(`MATCH (c:Chunk {blogId: $id}) DETACH DELETE c`, {
        id: req.params.id,
      });
      await session.run(`MATCH (b:BlogVec {blogId: $id}) DETACH DELETE b`, {
        id: req.params.id,
      });
      await session.close();
    } catch (e) {
      console.error("Failed to remove blog from Neo4j:", e.message);
    }

    res.json({ message: "Blog deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Like/Unlike a blog post
exports.toggleLike = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const userId = req.user.id;
    const hasLiked = blog.likes.includes(userId);

    if (hasLiked) {
      // Unlike the blog
      blog.likes = blog.likes.filter((id) => id.toString() !== userId);
    } else {
      // Like the blog
      blog.likes.push(userId);
    }

    await blog.save();

    // Return the updated blog with populated fields
    const updatedBlog = await Blog.findById(req.params.id)
      .populate("author", "username email")
      .populate("comments.author", "username email")
      .populate("likes", "username email");

    res.json(updatedBlog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a comment to a blog post
exports.addComment = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Comment content is required" });
    }

    const newComment = {
      author: req.user.id,
      content: content.trim(),
      createdAt: new Date(),
    };

    blog.comments.push(newComment);
    await blog.save();

    // Return the updated blog with populated fields
    const updatedBlog = await Blog.findById(req.params.id)
      .populate("author", "username email")
      .populate("comments.author", "username email")
      .populate("likes", "username email");

    res.json(updatedBlog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a comment from a blog post
exports.deleteComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const comment = blog.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // Check if user is the comment author or blog author
    if (
      comment.author.toString() !== req.user.id &&
      blog.author.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    blog.comments.pull(commentId);
    await blog.save();

    // Return the updated blog with populated fields
    const updatedBlog = await Blog.findById(id)
      .populate("author", "username email")
      .populate("comments.author", "username email")
      .populate("likes", "username email");

    res.json(updatedBlog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
