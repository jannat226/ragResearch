// server/controllers/blogController.js
const Blog = require("../models/Blog");

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
      .populate("author", "username email")
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
