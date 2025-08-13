// Working App.jsx - Step by step rebuild
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";
import axios from "axios";

// Auth Context
import { AuthContext, useAuth } from "./contexts/AuthContext";

// Set up axios defaults
const apiBase = import.meta.env.VITE_API_URL || "";
axios.defaults.baseURL = apiBase;

// Simple Login Component
const SimpleLogin = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("/api/auth/login", formData);
      login(response.data.user, response.data.token);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "2rem",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>Login</h2>

        {error && (
          <div
            style={{
              background: "#fee",
              color: "#c33",
              padding: "1rem",
              borderRadius: "6px",
              marginBottom: "1rem",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>
              Email:
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "6px",
              }}
              required
            />
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>
              Password:
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "6px",
              }}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              background: "#667eea",
              color: "white",
              padding: "12px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#667eea" }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

// Simple Register Component
const SimpleRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await axios.post("/api/auth/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "2rem",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>Register</h2>

        {error && (
          <div
            style={{
              background: "#fee",
              color: "#c33",
              padding: "1rem",
              borderRadius: "6px",
              marginBottom: "1rem",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>
              Username:
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "6px",
              }}
              required
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>
              Email:
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "6px",
              }}
              required
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>
              Password:
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "6px",
              }}
              required
            />
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>
              Confirm Password:
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "6px",
              }}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              background: "#764ba2",
              color: "white",
              padding: "12px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#764ba2" }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

// Simple Home Component
const SimpleHome = () => {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const heroStyles = {
    background:
      "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%)",
    backgroundSize: "200% 200%",
    animation: "gradient 8s ease infinite",
    color: "white",
    padding: "4rem 2rem",
    textAlign: "center",
    position: "relative",
    overflow: "hidden",
    minHeight: "70vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  };

  const floatingParticles = Array.from({ length: 8 }, (_, i) => (
    <div
      key={i}
      style={{
        position: "absolute",
        width: `${60 + i * 10}px`,
        height: `${60 + i * 10}px`,
        borderRadius: "50%",
        background: `rgba(255, 255, 255, ${0.05 + i * 0.02})`,
        animation: `float ${4 + i * 0.7}s ease-in-out infinite`,
        top: `${10 + i * 12}%`,
        left: `${5 + i * 11}%`,
        zIndex: 0,
        backdropFilter: "blur(2px)",
      }}
    />
  ));

  return (
    <div
      style={{ minHeight: "100vh", background: "#f8fafc", overflow: "hidden" }}
    >
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .hero-title {
          animation: fadeInUp 1s ease-out;
          font-size: clamp(2rem, 5vw, 3rem);
          margin-bottom: 1rem;
          position: relative;
          z-index: 1;
          background: linear-gradient(-45deg, #fff, #e0e7ff, #fff, #f0f4ff);
          background-size: 400% 400%;
          animation: fadeInUp 1s ease-out, gradient 4s ease infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-subtitle {
          animation: fadeInUp 1s ease-out 0.3s both;
          font-size: clamp(1rem, 3vw, 1.2rem);
          margin-bottom: 2rem;
          position: relative;
          z-index: 1;
        }

        .hero-buttons {
          animation: fadeInUp 1s ease-out 0.6s both;
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
          position: relative;
          z-index: 1;
        }

        .hero-user-greeting {
          animation: pulse 2s ease-in-out infinite;
          font-size: 1.1rem;
          position: relative;
          z-index: 1;
        }

        .cta-button {
          background: rgba(255,255,255,0.2);
          color: white;
          padding: 12px 24px;
          border-radius: 25px;
          text-decoration: none;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.3);
        }

        .cta-button:hover {
          background: rgba(255,255,255,0.3);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.2);
        }

        .cta-button.primary {
          background: white;
          color: #667eea;
        }

        .cta-button.primary:hover {
          background: #f0f0f0;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.2);
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2rem;
          }
          .hero-subtitle {
            font-size: 1rem;
          }
          .hero-buttons {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>

      <div style={heroStyles}>
        {floatingParticles}
        <h1 className="hero-title">Welcome to ResearchBlog</h1>
        <p className="hero-subtitle">
          A platform for researchers and academics
        </p>

        {user ? (
          <p className="hero-user-greeting">Hello, {user.username}! 👋</p>
        ) : (
          <div className="hero-buttons">
            <Link to="/login" className="cta-button">
              Login
            </Link>
            <Link to="/register" className="cta-button primary">
              Sign Up
            </Link>
          </div>
        )}
      </div>

      <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
        <h2
          style={{
            marginBottom: "2rem",
            animation: isVisible ? "fadeInUp 1s ease-out 0.8s both" : "none",
          }}
        >
          Features
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "2rem",
            maxWidth: "1000px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              padding: "2rem",
              background: "white",
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              transition: "all 0.3s ease",
              animation: isVisible ? "slideInLeft 1s ease-out 1s both" : "none",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-10px)";
              e.target.style.boxShadow = "0 12px 40px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 20px rgba(0,0,0,0.1)";
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📚</div>
            <h3 style={{ marginBottom: "1rem", color: "#333" }}>
              Rich Content
            </h3>
            <p style={{ color: "#666", lineHeight: "1.6" }}>
              Share your research with rich formatting and media
            </p>
          </div>
          <div
            style={{
              padding: "2rem",
              background: "white",
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              transition: "all 0.3s ease",
              animation: isVisible ? "fadeInUp 1s ease-out 1.2s both" : "none",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-10px)";
              e.target.style.boxShadow = "0 12px 40px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 20px rgba(0,0,0,0.1)";
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🤝</div>
            <h3 style={{ marginBottom: "1rem", color: "#333" }}>Community</h3>
            <p style={{ color: "#666", lineHeight: "1.6" }}>
              Connect with researchers worldwide
            </p>
          </div>
          <div
            style={{
              padding: "2rem",
              background: "white",
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              transition: "all 0.3s ease",
              animation: isVisible
                ? "slideInRight 1s ease-out 1.4s both"
                : "none",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-10px)";
              e.target.style.boxShadow = "0 12px 40px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 20px rgba(0,0,0,0.1)";
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🤖</div>
            <h3 style={{ marginBottom: "1rem", color: "#333" }}>AI-Powered</h3>
            <p style={{ color: "#666", lineHeight: "1.6" }}>
              Get AI assistance for your research
            </p>
          </div>
        </div>
      </div>

      {/* Animated Footer Section */}
      <div
        style={{
          background: "linear-gradient(135deg, #2d3748 0%, #4a5568 100%)",
          color: "white",
          padding: "3rem 2rem 2rem",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "100px",
            height: "4px",
            background: "linear-gradient(90deg, #667eea, #764ba2)",
            borderRadius: "2px",
            animation: isVisible ? "slideInLeft 1s ease-out 1.6s both" : "none",
          }}
        />

        <div
          style={{
            animation: isVisible ? "fadeInUp 1s ease-out 1.8s both" : "none",
            marginTop: "1rem",
          }}
        >
          <h3 style={{ marginBottom: "1rem", fontSize: "1.5rem" }}>
            Ready to start your research journey?
          </h3>
          <p
            style={{
              marginBottom: "2rem",
              color: "#cbd5e0",
              maxWidth: "600px",
              margin: "0 auto 2rem",
              lineHeight: "1.6",
            }}
          >
            Join thousands of researchers sharing knowledge and discovering new
            insights with AI-powered assistance.
          </p>

          {!user && (
            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
                flexWrap: "wrap",
                marginBottom: "2rem",
              }}
            >
              <Link
                to="/register"
                style={{
                  background: "linear-gradient(135deg, #667eea, #764ba2)",
                  color: "white",
                  padding: "12px 30px",
                  borderRadius: "25px",
                  textDecoration: "none",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow =
                    "0 8px 25px rgba(102, 126, 234, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow =
                    "0 4px 15px rgba(102, 126, 234, 0.3)";
                }}
              >
                Get Started Today
              </Link>
            </div>
          )}

          <div
            style={{
              paddingTop: "2rem",
              borderTop: "1px solid rgba(255,255,255,0.1)",
              color: "#a0aec0",
              fontSize: "0.9rem",
            }}
          >
            <p>© 2025 ResearchBlog. Empowering researchers worldwide.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple Navbar Component
const SimpleNavbar = () => {
  const { user, logout } = useAuth();

  const handleLogoutClick = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      logout();
    }
  };

  const navLinkStyle = {
    color: "white",
    textDecoration: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    transition: "all 0.3s ease",
    position: "relative",
    overflow: "hidden",
  };

  const userGreetingStyle = {
    color: "white",
    padding: "8px 16px",
    fontWeight: "500",
    background: "rgba(255,255,255,0.1)",
    borderRadius: "20px",
    backdropFilter: "blur(10px)",
    cursor: "pointer",
    transition: "all 0.3s ease",
    border: "1px solid rgba(255,255,255,0.2)",
  };

  return (
    <>
      <style>{`
        @keyframes slideDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .nav-link:hover {
          background: rgba(255,255,255,0.1);
          transform: translateY(-2px);
        }

        .user-greeting:hover {
          background: rgba(255,255,255,0.2);
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        .brand-logo {
          background: linear-gradient(45deg, #fff, #e0e7ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          transition: all 0.3s ease;
        }

        .brand-logo:hover {
          transform: scale(1.05);
          text-shadow: 0 0 20px rgba(255,255,255,0.5);
        }
      `}</style>
      <nav
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "1rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          backdropFilter: "blur(20px)",
          animation: "slideDown 0.8s ease-out",
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        <Link
          to="/"
          className="brand-logo"
          style={{
            color: "white",
            textDecoration: "none",
            fontSize: "1.5rem",
            fontWeight: "bold",
          }}
        >
          ResearchBlog
        </Link>

        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <Link to="/blogs" className="nav-link" style={navLinkStyle}>
            Blogs
          </Link>
          {user ? (
            <>
              <Link to="/create" className="nav-link" style={navLinkStyle}>
                Create Blog
              </Link>
              <Link to="/ask" className="nav-link" style={navLinkStyle}>
                Ask AI
              </Link>
              <span
                className="user-greeting"
                style={userGreetingStyle}
                onClick={handleLogoutClick}
                title="Click to logout"
              >
                Hello, {user.username}
              </span>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" style={navLinkStyle}>
                Login
              </Link>
              <Link to="/register" className="nav-link" style={navLinkStyle}>
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </>
  );
};

// Simple Blog List Component
const SimpleBlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("/api/blogs");
        setBlogs(response.data);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        Loading blogs...
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "2rem" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <h1
          style={{ textAlign: "center", marginBottom: "2rem", color: "#333" }}
        >
          Research Blogs
        </h1>

        {blogs.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "4rem",
              background: "white",
              borderRadius: "8px",
            }}
          >
            <p style={{ fontSize: "1.2rem", color: "#666" }}>
              No blogs found. Be the first to create one!
            </p>
            <Link
              to="/create"
              style={{
                display: "inline-block",
                marginTop: "1rem",
                background: "#667eea",
                color: "white",
                padding: "12px 24px",
                borderRadius: "6px",
                textDecoration: "none",
              }}
            >
              Create Blog
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "2rem" }}>
            {blogs.map((blog) => (
              <div
                key={blog._id}
                style={{
                  background: "white",
                  padding: "2rem",
                  borderRadius: "8px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                }}
              >
                <h2 style={{ marginBottom: "1rem", color: "#333" }}>
                  {blog.title}
                </h2>
                <p
                  style={{
                    color: "#666",
                    marginBottom: "1rem",
                    lineHeight: "1.6",
                  }}
                >
                  {blog.content.substring(0, 200)}...
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderTop: "1px solid #eee",
                    paddingTop: "1rem",
                  }}
                >
                  <span style={{ color: "#888", fontSize: "0.9rem" }}>
                    By {blog.author?.username || "Unknown"} •{" "}
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </span>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <Link
                      to={`/blogs/${blog._id}`}
                      style={{
                        background: "#667eea",
                        color: "white",
                        padding: "8px 16px",
                        borderRadius: "4px",
                        textDecoration: "none",
                        fontSize: "14px",
                      }}
                    >
                      Read More
                    </Link>
                    <Link
                      to={`/blogs/${blog._id}#ask-ai`}
                      style={{
                        background: "#28a745",
                        color: "white",
                        padding: "8px 12px",
                        borderRadius: "4px",
                        textDecoration: "none",
                        fontSize: "12px",
                      }}
                      title="Ask AI about this blog"
                    >
                      🤖 Ask AI
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Simple Create Blog Component
const SimpleCreateBlog = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post("/api/blogs", formData);
      navigate("/blogs");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "2rem" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h1
          style={{ textAlign: "center", marginBottom: "2rem", color: "#333" }}
        >
          Create New Blog
        </h1>

        <div
          style={{
            background: "white",
            padding: "2rem",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          {error && (
            <div
              style={{
                background: "#fee",
                color: "#c33",
                padding: "1rem",
                borderRadius: "6px",
                marginBottom: "1rem",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "2rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "bold",
                  color: "#333",
                }}
              >
                Title:
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  fontSize: "16px",
                }}
                placeholder="Enter your blog title"
                required
              />
            </div>

            <div style={{ marginBottom: "2rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "bold",
                  color: "#333",
                }}
              >
                Content:
              </label>
              <textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  fontSize: "16px",
                  minHeight: "300px",
                  resize: "vertical",
                }}
                placeholder="Write your blog content here..."
                required
              />
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  background: "#667eea",
                  color: "white",
                  padding: "12px 24px",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                {loading ? "Publishing..." : "Publish Blog"}
              </button>
              <Link
                to="/blogs"
                style={{
                  background: "#6c757d",
                  color: "white",
                  padding: "12px 24px",
                  borderRadius: "6px",
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Simple Blog Detail Component
const SimpleBlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // AI Ask feature state
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`/api/blogs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBlog(response.data);
      } catch (error) {
        console.error("Error fetching blog:", error);
        setError("Failed to load blog");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlog();
    }
  }, [id]);

  // Scroll to Ask AI section if hash is present
  useEffect(() => {
    if (window.location.hash === "#ask-ai" && blog) {
      setTimeout(() => {
        const askAiSection = document.getElementById("ask-ai-section");
        if (askAiSection) {
          askAiSection.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, [blog]);

  const handleAskAI = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setAiLoading(true);
    setAiError("");
    setAnswer("");

    try {
      const token = localStorage.getItem("token");
      const contextualQuestion = `Based on the blog titled "${
        blog?.title
      }" with the following content: "${blog?.content?.substring(
        0,
        500
      )}...", please answer this question: ${question}`;

      const response = await axios.post(
        "/api/ask",
        { question: contextualQuestion },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAnswer(response.data.answer || "No answer received");
    } catch (error) {
      console.error("Error asking AI:", error);
      setAiError(error.response?.data?.message || "Failed to get AI response");
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{ minHeight: "100vh", background: "#f8fafc", padding: "2rem" }}
      >
        <div style={{ textAlign: "center", marginTop: "4rem" }}>
          <h3>Loading blog...</h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{ minHeight: "100vh", background: "#f8fafc", padding: "2rem" }}
      >
        <div style={{ textAlign: "center", marginTop: "4rem" }}>
          <h3 style={{ color: "red", marginBottom: "1rem" }}>{error}</h3>
          <button
            onClick={() => navigate("/blogs")}
            style={{
              padding: "10px 20px",
              backgroundColor: "#667eea",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div
        style={{ minHeight: "100vh", background: "#f8fafc", padding: "2rem" }}
      >
        <div style={{ textAlign: "center", marginTop: "4rem" }}>
          <h3 style={{ marginBottom: "1rem" }}>Blog not found</h3>
          <button
            onClick={() => navigate("/blogs")}
            style={{
              padding: "10px 20px",
              backgroundColor: "#667eea",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "2rem" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <button
          onClick={() => navigate("/blogs")}
          style={{
            marginBottom: "2rem",
            padding: "10px 20px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          ← Back to Blogs
        </button>

        <div
          style={{
            background: "white",
            padding: "2rem",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <article>
            <h1
              style={{
                color: "#333",
                marginBottom: "1rem",
                fontSize: "2.5rem",
                lineHeight: "1.2",
              }}
            >
              {blog.title}
            </h1>

            <div
              style={{
                marginBottom: "2rem",
                padding: "1rem 0",
                borderBottom: "1px solid #eee",
                color: "#666",
                fontSize: "14px",
              }}
            >
              <p style={{ margin: "0 0 0.5rem 0" }}>
                <strong>Author:</strong>{" "}
                {blog.author?.username || "Unknown Author"}
              </p>
              <p style={{ margin: "0" }}>
                <strong>Published:</strong>{" "}
                {new Date(blog.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div
              style={{
                lineHeight: "1.8",
                fontSize: "16px",
                whiteSpace: "pre-wrap",
                color: "#333",
              }}
            >
              {blog.content}
            </div>
          </article>
        </div>

        {/* Ask AI Section */}
        <div
          id="ask-ai-section"
          style={{
            background: "white",
            padding: "2rem",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            marginTop: "2rem",
          }}
        >
          <h3
            style={{
              color: "#333",
              marginBottom: "1rem",
              borderBottom: "2px solid #667eea",
              paddingBottom: "0.5rem",
            }}
          >
            🤖 Ask AI about this blog
          </h3>

          <form onSubmit={handleAskAI}>
            <div style={{ marginBottom: "1rem" }}>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  fontSize: "14px",
                  minHeight: "80px",
                  resize: "vertical",
                }}
                placeholder={`Ask a question about "${blog?.title}"`}
                required
              />
            </div>

            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <button
                type="submit"
                disabled={aiLoading || !question.trim()}
                style={{
                  background: aiLoading ? "#ccc" : "#667eea",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "6px",
                  cursor: aiLoading ? "not-allowed" : "pointer",
                  fontSize: "14px",
                }}
              >
                {aiLoading ? "Getting Answer..." : "Ask AI"}
              </button>

              {question && (
                <button
                  type="button"
                  onClick={() => {
                    setQuestion("");
                    setAnswer("");
                    setAiError("");
                  }}
                  style={{
                    background: "#6c757d",
                    color: "white",
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Clear
                </button>
              )}
            </div>
          </form>

          {aiError && (
            <div
              style={{
                background: "#fee",
                color: "#c33",
                padding: "1rem",
                borderRadius: "6px",
                marginTop: "1rem",
              }}
            >
              {aiError}
            </div>
          )}

          {answer && (
            <div
              style={{
                background: "#f8f9fa",
                padding: "1.5rem",
                borderRadius: "6px",
                marginTop: "1rem",
                border: "1px solid #e9ecef",
              }}
            >
              <h4
                style={{
                  color: "#333",
                  marginBottom: "0.5rem",
                  fontSize: "16px",
                }}
              >
                💡 AI Response:
              </h4>
              <div
                style={{
                  lineHeight: "1.6",
                  fontSize: "14px",
                  whiteSpace: "pre-wrap",
                  color: "#555",
                }}
              >
                {answer}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Enhanced Ask AI Component with Research Papers and Similar Blogs
const SimpleAskAI = () => {
  const [question, setQuestion] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setError("");
    setResults(null);

    try {
      const token = localStorage.getItem("token");

      // Make multiple API calls to get comprehensive results
      const [aiResponse, searchResponse, relatedBlogsResponse] =
        await Promise.all([
          // Get AI answer
          axios.post(
            "/api/ask",
            { question },
            { headers: { Authorization: `Bearer ${token}` } }
          ),
          // Search for research papers/documents
          axios.get(`/api/search?q=${encodeURIComponent(question)}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          // Get related blogs
          axios
            .get(`/api/blogs/search?q=${encodeURIComponent(question)}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
            .catch(() => ({ data: [] })), // Fallback if this endpoint doesn't exist
        ]);

      setResults({
        answer: aiResponse.data.answer || "No answer received",
        papers:
          searchResponse.data.papers || searchResponse.data.documents || [],
        relatedBlogs:
          relatedBlogsResponse.data.blogs || relatedBlogsResponse.data || [],
        sources: searchResponse.data.sources || [],
      });
    } catch (error) {
      console.error("Error asking AI:", error);
      setError(error.response?.data?.message || "Failed to get AI response");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "2rem" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <h1
          style={{ textAlign: "center", marginBottom: "2rem", color: "#333" }}
        >
          Research Assistant with AI
        </h1>

        <div
          style={{
            background: "white",
            padding: "2rem",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            marginBottom: "2rem",
          }}
        >
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "bold",
                  color: "#333",
                }}
              >
                Ask a research question:
              </label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  fontSize: "16px",
                  minHeight: "120px",
                  resize: "vertical",
                }}
                placeholder="e.g., 'What are the latest advances in machine learning for natural language processing?'"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || !question.trim()}
              style={{
                background: loading ? "#ccc" : "#667eea",
                color: "white",
                padding: "12px 24px",
                border: "none",
                borderRadius: "6px",
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: "16px",
              }}
            >
              {loading ? "Searching & Analyzing..." : "Get Research Insights"}
            </button>
          </form>
        </div>

        {error && (
          <div
            style={{
              background: "#fee",
              color: "#c33",
              padding: "1rem",
              borderRadius: "6px",
              marginBottom: "2rem",
            }}
          >
            {error}
          </div>
        )}

        {results && (
          <div style={{ display: "grid", gap: "2rem" }}>
            {/* AI Answer Section */}
            <div
              style={{
                background: "white",
                padding: "2rem",
                borderRadius: "8px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              }}
            >
              <h3
                style={{
                  color: "#333",
                  marginBottom: "1rem",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {results.noRelevantContent
                  ? "🔍 No Blog Content Found"
                  : "🤖 AI Analysis"}
              </h3>
              <div
                style={{
                  lineHeight: "1.6",
                  fontSize: "16px",
                  whiteSpace: "pre-wrap",
                  color: results.noRelevantContent ? "#e67e22" : "#333",
                  background: results.noRelevantContent
                    ? "#fff3cd"
                    : "transparent",
                  padding: results.noRelevantContent ? "1rem" : "0",
                  borderRadius: results.noRelevantContent ? "6px" : "0",
                  border: results.noRelevantContent
                    ? "1px solid #f39c12"
                    : "none",
                }}
              >
                {results.answer}
                {results.noRelevantContent && (
                  <div
                    style={{
                      marginTop: "1rem",
                      fontSize: "14px",
                      color: "#8e44ad",
                    }}
                  >
                    💡 <strong>Tip:</strong> Check out the research papers below
                    for relevant information, or try creating a blog post on
                    this topic!
                  </div>
                )}
              </div>
            </div>

            {/* Research Papers Section */}
            {(results.papers && results.papers.length > 0) ||
            results.noPapersFound ? (
              <div
                style={{
                  background: "white",
                  padding: "2rem",
                  borderRadius: "8px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                }}
              >
                <h3
                  style={{
                    color: "#333",
                    marginBottom: "1rem",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {results.noPapersFound
                    ? "� Research Papers Search"
                    : "�📄 Related Research Papers"}
                </h3>

                {results.noPapersFound ? (
                  <div
                    style={{
                      padding: "1.5rem",
                      background: "#fff3cd",
                      border: "1px solid #f39c12",
                      borderRadius: "6px",
                      color: "#856404",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "16px", marginBottom: "0.5rem" }}>
                      📚{" "}
                      {results.papersMessage ||
                        "Sorry, I wasn't able to find any research papers on this specific topic."}
                    </div>
                    <div style={{ fontSize: "14px", color: "#6c757d" }}>
                      Try refining your search terms or exploring related
                      topics.
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "grid", gap: "1rem" }}>
                    {results.papers.slice(0, 5).map((paper, index) => (
                      <div
                        key={index}
                        style={{
                          padding: "1rem",
                          border: "1px solid #e0e0e0",
                          borderRadius: "6px",
                          background: "#f9f9f9",
                        }}
                      >
                        <h4
                          style={{
                            color: "#2196F3",
                            marginBottom: "0.5rem",
                            fontSize: "16px",
                          }}
                        >
                          {paper.title || `Research Paper ${index + 1}`}
                        </h4>
                        <p
                          style={{
                            color: "#666",
                            fontSize: "14px",
                            marginBottom: "0.5rem",
                          }}
                        >
                          {paper.authors && `Authors: ${paper.authors}`}
                        </p>
                        <p
                          style={{
                            fontSize: "14px",
                            lineHeight: "1.4",
                            color: "#333",
                          }}
                        >
                          {paper.abstract ||
                            paper.summary ||
                            paper.content?.substring(0, 200) + "..."}
                        </p>
                        {paper.url && (
                          <a
                            href={paper.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: "#2196F3",
                              fontSize: "14px",
                              textDecoration: "none",
                            }}
                          >
                            📎 View Paper
                          </a>
                        )}
                        {paper.doi && (
                          <p
                            style={{
                              fontSize: "12px",
                              color: "#888",
                              marginTop: "0.5rem",
                            }}
                          >
                            DOI: {paper.doi}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : null}

            {/* Related Blogs Section */}
            {results.relatedBlogs && results.relatedBlogs.length > 0 && (
              <div
                style={{
                  background: "white",
                  padding: "2rem",
                  borderRadius: "8px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                }}
              >
                <h3
                  style={{
                    color: "#333",
                    marginBottom: "1rem",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  📝 Similar Blog Posts
                </h3>
                <div style={{ display: "grid", gap: "1rem" }}>
                  {results.relatedBlogs.slice(0, 4).map((blog) => (
                    <div
                      key={blog._id}
                      style={{
                        padding: "1rem",
                        border: "1px solid #e0e0e0",
                        borderRadius: "6px",
                        background: "#f9f9f9",
                      }}
                    >
                      <h4
                        style={{
                          color: "#2196F3",
                          marginBottom: "0.5rem",
                          fontSize: "16px",
                        }}
                      >
                        {blog.title}
                      </h4>
                      <p
                        style={{
                          color: "#666",
                          fontSize: "14px",
                          marginBottom: "0.5rem",
                        }}
                      >
                        By: {blog.author?.username || "Unknown"} •{" "}
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </p>
                      <p
                        style={{
                          fontSize: "14px",
                          lineHeight: "1.4",
                          color: "#333",
                          marginBottom: "1rem",
                        }}
                      >
                        {blog.content?.substring(0, 150)}...
                      </p>
                      <Link
                        to={`/blogs/${blog._id}`}
                        style={{
                          color: "#2196F3",
                          textDecoration: "none",
                          fontSize: "14px",
                          fontWeight: "bold",
                        }}
                      >
                        Read Full Blog →
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sources Section */}
            {results.sources && results.sources.length > 0 && (
              <div
                style={{
                  background: "white",
                  padding: "2rem",
                  borderRadius: "8px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                }}
              >
                <h3
                  style={{
                    color: "#333",
                    marginBottom: "1rem",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  🔗 Additional Sources
                </h3>
                <div style={{ display: "grid", gap: "0.5rem" }}>
                  {results.sources.slice(0, 5).map((source, index) => (
                    <div
                      key={index}
                      style={{
                        padding: "0.5rem 0",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      <a
                        href={source.url || source.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "#2196F3",
                          textDecoration: "none",
                          fontSize: "14px",
                        }}
                      >
                        {source.title || source.name || `Source ${index + 1}`}
                      </a>
                      {source.description && (
                        <p
                          style={{
                            fontSize: "12px",
                            color: "#666",
                            marginTop: "0.25rem",
                          }}
                        >
                          {source.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      setUser(JSON.parse(userData));
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <Router>
        <div style={{ minHeight: "100vh" }}>
          <SimpleNavbar />
          <Routes>
            <Route path="/" element={<SimpleHome />} />
            <Route
              path="/login"
              element={user ? <Navigate to="/" /> : <SimpleLogin />}
            />
            <Route
              path="/register"
              element={user ? <Navigate to="/" /> : <SimpleRegister />}
            />
            <Route path="/blogs" element={<SimpleBlogList />} />
            <Route
              path="/blogs/:id"
              element={user ? <SimpleBlogDetail /> : <Navigate to="/login" />}
            />
            <Route
              path="/create"
              element={user ? <SimpleCreateBlog /> : <Navigate to="/login" />}
            />
            <Route
              path="/ask"
              element={user ? <SimpleAskAI /> : <Navigate to="/login" />}
            />
          </Routes>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
