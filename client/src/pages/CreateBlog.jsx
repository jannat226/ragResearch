// client/src/pages/CreateBlog.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../App";
import axios from "axios";

const api = import.meta.env.VITE_API_URL;
import {
  PenTool,
  Image as ImageIcon,
  Save,
  Eye,
  ArrowLeft,
} from "lucide-react";

const CreateBlog = ({ isEdit = false }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams(); // For edit mode
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    imageUrl: "",
    imageFile: null,
  });
  const [imageInputType, setImageInputType] = useState("url"); // 'url' or 'upload'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(false);

  // Fetch blog data for editing
  useEffect(() => {
    if (isEdit && id) {
      fetchBlogForEdit();
    }
  }, [isEdit, id]);

  const fetchBlogForEdit = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${api}/api/blogs/${id}`);
      const blog = response.data;

      // Check if user is the author
      if (blog.author._id !== user.id) {
        setError("You are not authorized to edit this blog");
        navigate("/blogs");
        return;
      }

      setFormData({
        title: blog.title,
        content: blog.content,
        imageUrl: blog.image || "",
        imageFile: null,
      });
    } catch (err) {
      setError("Failed to fetch blog for editing");
      console.error("Error fetching blog:", err);
    } finally {
      setLoading(false);
    }
  };

  // Cleanup URL.createObjectURL on unmount or file change
  useEffect(() => {
    return () => {
      if (formData.imageFile) {
        URL.revokeObjectURL(URL.createObjectURL(formData.imageFile));
      }
    };
  }, [formData.imageFile]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imageFile") {
      setFormData((prev) => {
        // Revoke previous object URL
        if (prev.imageFile)
          URL.revokeObjectURL(URL.createObjectURL(prev.imageFile));
        return {
          ...prev,
          imageFile: files[0],
          imageUrl: "",
        };
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        ...(name === "imageUrl" ? { imageFile: null } : {}),
      }));
    }
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.title.trim() || !formData.content.trim()) {
      setError("Title and content are required.");
      setLoading(false);
      return;
    }

    try {
      let dataToSend;
      const config = {};

      if (imageInputType === "upload" && formData.imageFile) {
        dataToSend = new FormData();
        dataToSend.append("title", formData.title);
        dataToSend.append("content", formData.content);
        dataToSend.append("image", formData.imageFile);
        config.headers = { "Content-Type": "multipart/form-data" };
      } else if (imageInputType === "url" && formData.imageUrl) {
        dataToSend = {
          title: formData.title,
          content: formData.content,
          image: formData.imageUrl,
        };
      } else {
        dataToSend = {
          title: formData.title,
          content: formData.content,
        };
      }

      const response = isEdit
        ? await axios.put(`${api}/api/blogs/${id}`, dataToSend, config)
        : await axios.post(`${api}/api/blogs`, dataToSend, config);

      navigate(`/blogs/${isEdit ? id : response.data._id}`);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          `Failed to ${isEdit ? "update" : "create"} blog. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/blogs");
  };

  const applyMarkdown = (syntax) => {
    const textarea = document.getElementById("content");
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const val = formData.content;
    const before = val.substring(0, start);
    const selected = val.substring(start, end) || "text";
    const after = val.substring(end);

    const map = {
      bold: `**${selected}**`,
      italic: `*${selected}*`,
      h2: `## ${selected}`,
      list: `- ${selected}`,
      link: `[${selected}](https://)`,
    };
    const inserted = map[syntax] || selected;
    const next = `${before}${inserted}${after}`;
    setFormData((p) => ({ ...p, content: next }));
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = before.length;
      textarea.selectionEnd = before.length + inserted.length;
    }, 0);
  };

  if (!user) {
    return (
      <div className="create-blog-container">
        <div className="card text-center">
          <h1>Please log in to create a blog post</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="create-blog-container fade-in">
      <div className="create-blog-header">
        <button onClick={handleBack} className="btn btn-ghost">
          <ArrowLeft size={20} />
          Back to Blogs
        </button>
        <div className="header-actions">
          <button
            type="button"
            onClick={() => setPreview(!preview)}
            className="btn btn-secondary"
          >
            <Eye size={18} />
            {preview ? "Edit" : "Preview"}
          </button>
        </div>
      </div>

      <div className="create-blog-content">
        {!preview ? (
          // Edit Mode
          <div className="card">
            <div className="card-header">
              <div className="create-blog-icon">
                <PenTool size={32} />
              </div>
              <h1 className="card-title">
                {isEdit ? "Edit Blog Post" : "Create New Blog Post"}
              </h1>
              <p className="card-subtitle">
                {isEdit
                  ? "Update your blog post"
                  : "Share your thoughts with the world"}
              </p>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              {/* Title Field */}
              <div className="form-group">
                <label htmlFor="title" className="form-label">
                  Blog Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter an engaging title for your blog..."
                  required
                  style={{ color: "#2d3748", background: "white" }}
                />
              </div>

              {/* Image Input Type Selector */}
              <div className="form-group">
                <label className="form-label">Cover Image</label>
                <div
                  className="radio-group"
                  style={{ marginBottom: "1rem", display: "flex", gap: "1rem" }}
                >
                  <label>
                    <input
                      type="radio"
                      name="imageInputType"
                      value="url"
                      checked={imageInputType === "url"}
                      onChange={() => setImageInputType("url")}
                    />
                    Image URL
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="imageInputType"
                      value="upload"
                      checked={imageInputType === "upload"}
                      onChange={() => setImageInputType("upload")}
                    />
                    Upload Image
                  </label>
                </div>

                {/* Image URL Input */}
                {imageInputType === "url" && (
                  <>
                    <input
                      type="url"
                      id="imageUrl"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="https://example.com/image.jpg"
                    />
                    {formData.imageUrl && (
                      <div className="image-preview">
                        <img
                          src={formData.imageUrl}
                          alt="Cover preview"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      </div>
                    )}
                  </>
                )}

                {/* Image File Upload */}
                {imageInputType === "upload" && (
                  <>
                    <input
                      type="file"
                      id="imageFile"
                      name="imageFile"
                      accept="image/*"
                      onChange={handleChange}
                      className="form-input"
                    />
                    {formData.imageFile && (
                      <div className="image-preview">
                        <img
                          src={URL.createObjectURL(formData.imageFile)}
                          alt="Cover preview"
                        />
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Content Field */}
              <div className="form-group">
                <label htmlFor="content" className="form-label">
                  Blog Content
                </label>
                <div className="md-toolbar">
                  <button type="button" onClick={() => applyMarkdown("bold")}>
                    <strong>B</strong>
                  </button>
                  <button type="button" onClick={() => applyMarkdown("italic")}>
                    <em>I</em>
                  </button>
                  <button type="button" onClick={() => applyMarkdown("h2")}>
                    H2
                  </button>
                  <button type="button" onClick={() => applyMarkdown("list")}>
                    • List
                  </button>
                  <button type="button" onClick={() => applyMarkdown("link")}>
                    Link
                  </button>
                  <span className="muted">Supports Markdown</span>
                </div>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  className="form-textarea editor-textarea"
                  placeholder="Write your blog content here... Use Markdown or the toolbar to format."
                  required
                  rows="20"
                  style={{ color: "#111827" }}
                />
                <div className="character-count">
                  {formData.content.length} characters
                </div>
              </div>

              {/* Submit Button */}
              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={
                    loading ||
                    !formData.title.trim() ||
                    !formData.content.trim()
                  }
                >
                  {loading ? (
                    <>
                      <div className="loading-spinner-sm"></div>
                      {isEdit ? "Updating..." : "Publishing..."}
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      {isEdit ? "Update Blog" : "Publish Blog"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          // Preview Mode
          <div className="card">
            <div className="preview-header">
              <h2>Preview</h2>
              <p>This is how your blog will appear to readers</p>
            </div>
            <article className="blog-preview">
              {(imageInputType === "url" && formData.imageUrl) ||
              (imageInputType === "upload" && formData.imageFile) ? (
                <div className="preview-image-container">
                  <img
                    src={
                      imageInputType === "url"
                        ? formData.imageUrl
                        : URL.createObjectURL(formData.imageFile)
                    }
                    alt={formData.title || "Blog cover"}
                    className="preview-image"
                  />
                </div>
              ) : null}

              <div className="preview-content">
                <h1 className="preview-title">
                  {formData.title || "Your Blog Title"}
                </h1>
                <div className="preview-meta">
                  <div className="preview-author">By {user.username}</div>
                  <div className="preview-date">
                    {new Date().toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
                <div className="preview-text">
                  {formData.content ? (
                    formData.content
                      .split("\n")
                      .map((paragraph, index) => (
                        <p key={index}>{paragraph.trim()}</p>
                      ))
                  ) : (
                    <p className="placeholder-text">
                      Your blog content will appear here...
                    </p>
                  )}
                </div>
              </div>
            </article>
          </div>
        )}
      </div>

      <style jsx>{`
        .create-blog-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 1rem;
        }
        .create-blog-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .header-actions {
          display: flex;
          gap: 1rem;
        }
        .create-blog-icon {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          margin: 0 auto 1rem;
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
        }
        .image-preview {
          margin-top: 1rem;
          border-radius: 12px;
          overflow: hidden;
          max-height: 200px;
        }
        .image-preview img {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }
        .character-count {
          font-size: 0.8rem;
          color: #718096;
          text-align: right;
          margin-top: 0.5rem;
        }
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid #e5e7eb;
        }
        .loading-spinner-sm {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s linear infinite;
        }

        /* Preview Styles */
        .preview-header {
          text-align: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e5e7eb;
        }
        .preview-header h2 {
          color: #2d3748;
          margin-bottom: 0.5rem;
        }
        .preview-header p {
          color: #718096;
          margin: 0;
        }
        .blog-preview {
          max-width: none;
        }
        .preview-image-container {
          margin-bottom: 2rem;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        .preview-image {
          width: 100%;
          height: 300px;
          object-fit: cover;
        }
        .preview-content {
          padding: 0;
        }
        .preview-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #2d3748;
          line-height: 1.2;
          margin-bottom: 1.5rem;
        }
        .preview-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e5e7eb;
          font-size: 0.9rem;
          color: #718096;
        }
        .preview-author {
          font-weight: 600;
          color: #667eea;
        }
        .preview-text {
          font-size: 1.1rem;
          line-height: 1.8;
          color: #2d3748;
        }
        .preview-text p {
          margin-bottom: 1.5rem;
        }
        .placeholder-text {
          color: #a0aec0;
          font-style: italic;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 768px) {
          .create-blog-header {
            flex-direction: column;
            align-items: stretch;
          }
          .header-actions {
            justify-content: center;
          }
          .form-actions {
            justify-content: center;
          }
          .preview-title {
            font-size: 2rem;
          }
          .preview-meta {
            flex-direction: column;
            gap: 0.5rem;
            text-align: center;
          }
        }
      `}</style>
      <style jsx>{`
        .md-toolbar {
          display: flex;
          gap: 0.5rem;
          align-items: center;
          margin-bottom: 0.5rem;
        }
        .md-toolbar button {
          padding: 0.4rem 0.6rem;
          border: 1px solid #e5e7eb;
          background: white;
          border-radius: 8px;
          cursor: pointer;
          color: #111827;
        }
        .md-toolbar button:hover {
          background: #f3f4f6;
        }
        .editor-textarea {
          min-height: 480px;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
            monospace;
          color: #111827;
        }
      `}</style>
    </div>
  );
};

export default CreateBlog;
