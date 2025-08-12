require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const { ensureVectorIndexes } = require("./utils/neo4j");

const authRoutes = require("./routes/auth");
const blogRoutes = require("./routes/blog");
const ragRoutes = require("./routes/rag");

const app = express();

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, etc.)
      if (!origin) return callback(null, true);
      
      // Allow localhost for development
      if (origin.includes('localhost')) return callback(null, true);
      
      // Allow Render domains
      if (origin.includes('.onrender.com')) return callback(null, true);
      
      // For production, allow same origin
      callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api", ragRoutes);

// Simple health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Serve React static build
app.use(express.static(path.join(__dirname, "../client/dist")));

// Catch-all for client-side routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Ensure vector indexes (non-blocking)
ensureVectorIndexes().catch((e) => {
  console.error("Neo4j index setup failed:", e.message);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
