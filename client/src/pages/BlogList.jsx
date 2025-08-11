// client/src/pages/BlogList.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../App";
import axios from "axios";

const api = import.meta.env.VITE_API_URL;
import {
  BookOpen,
  Calendar,
  User,
  Search,
  PlusCircle,
  RefreshCw,
} from "lucide-react";

const BlogList = () => {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBlogs, setFilteredBlogs] = useState([]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    // Filter blogs based on search term
    const filtered = blogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.author.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBlogs(filtered);
  }, [blogs, searchTerm]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${api}/api/blogs`);
      setBlogs(response.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch blogs. Please try again.");
      console.error("Error fetching blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getExcerpt = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substr(0, maxLength) + "...";
  };

  if (loading) {
    return (
      <div className="blog-list-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading blogs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-list-container fade-in">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-text">
            <h1 className="page-title">
              <BookOpen size={32} />
              All Blogs
            </h1>
            <p className="page-subtitle">
              Discover amazing stories and insights from our community
            </p>
          </div>
          {user && (
            <Link to="/create" className="btn btn-primary">
              <PlusCircle size={20} />
              Write New Blog
            </Link>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="search-section">
        <div className="search-container">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search blogs by title, content, or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <button onClick={fetchBlogs} className="btn btn-secondary">
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      {/* Error State */}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Blogs Grid */}
      {filteredBlogs.length === 0 ? (
        <div className="empty-state">
          <BookOpen size={64} />
          <h2>No blogs found</h2>
          <p>
            {searchTerm
              ? `No blogs match your search for "${searchTerm}"`
              : "Be the first to share your thoughts!"}
          </p>
          {user && !searchTerm && (
            <Link to="/create" className="btn btn-primary">
              <PlusCircle size={20} />
              Write First Blog
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="results-info">
            <p>
              {filteredBlogs.length} blog{filteredBlogs.length !== 1 ? "s" : ""}{" "}
              found
              {searchTerm && ` for "${searchTerm}"`}
            </p>
          </div>

          <div className="blogs-grid">
            {filteredBlogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        </>
      )}

      <style jsx>{`
        .blog-list-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .page-header {
          margin-bottom: 3rem;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 2rem;
        }

        .header-text {
          flex: 1;
        }

        .page-title {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 2.5rem;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 0.5rem;
        }

        .page-subtitle {
          font-size: 1.1rem;
          color: #718096;
          margin: 0;
        }

        .search-section {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          align-items: center;
        }

        .search-container {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
          max-width: 500px;
        }

        .search-container svg {
          position: absolute;
          left: 1rem;
          color: #718096;
          z-index: 1;
        }

        .search-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 3rem;
          border: 2px solid #e5e7eb;
          border-radius: 50px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: white;
        }

        .search-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .results-info {
          margin-bottom: 1.5rem;
          color: #718096;
          font-size: 0.9rem;
        }

        .blogs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem;
          color: #718096;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem;
          text-align: center;
          color: #718096;
        }

        .empty-state h2 {
          margin: 1rem 0 0.5rem;
          color: #2d3748;
        }

        .empty-state p {
          margin-bottom: 2rem;
          max-width: 400px;
        }

        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            align-items: flex-start;
          }

          .page-title {
            font-size: 2rem;
          }

          .search-section {
            flex-direction: column;
          }

          .search-container {
            max-width: none;
          }

          .blogs-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

// Blog Card Component
const BlogCard = ({ blog }) => {
  return (
    <Link to={`/blogs/${blog._id}`} className="blog-card-link">
      <article className="blog-card">
        {blog.image && blog.image !== "optional-image-url" && (
          <div className="blog-card-image-container">
            <img
              src={blog.image}
              alt={blog.title}
              className="blog-card-image"
            />
          </div>
        )}
        <div className="blog-card-content">
          <h2 className="blog-card-title">{blog.title}</h2>
          <p className="blog-card-excerpt">
            {blog.content.length > 150
              ? blog.content.substring(0, 150) + "..."
              : blog.content}
          </p>
          <div className="blog-card-meta">
            <div className="blog-author">
              <User size={16} />
              <span>{blog.author.username}</span>
            </div>
            <div className="blog-date">
              <Calendar size={16} />
              <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </article>

      <style jsx>{`
        .blog-card-link {
          text-decoration: none;
          color: inherit;
        }

        .blog-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          border: 1px solid #f7fafc;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .blog-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
        }

        .blog-card-image-container {
          height: 200px;
          overflow: hidden;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .blog-card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .blog-card:hover .blog-card-image {
          transform: scale(1.05);
        }

        .blog-card-content {
          padding: 1.5rem;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .blog-card-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 0.75rem;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .blog-card-excerpt {
          color: #718096;
          font-size: 0.9rem;
          line-height: 1.6;
          margin-bottom: 1.5rem;
          flex: 1;
        }

        .blog-card-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.8rem;
          color: #a0aec0;
          border-top: 1px solid #f7fafc;
          padding-top: 1rem;
          margin-top: auto;
        }

        .blog-author,
        .blog-date {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .blog-author {
          color: #667eea;
          font-weight: 600;
        }
      `}</style>
    </Link>
  );
};

export default BlogList;
