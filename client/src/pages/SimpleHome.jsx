// Simple Home component for testing
import React from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  PenTool,
  Users,
  Heart,
  ArrowRight,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";

const SimpleHome = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        padding: "2rem",
      }}
    >
      {/* Hero Section */}
      <section style={{ textAlign: "center", paddingTop: "4rem" }}>
        <div>
          <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>
            Welcome to <span style={{ color: "#ffd700" }}>ResearchBlog</span>
          </h1>
          <p
            style={{
              fontSize: "1.2rem",
              marginBottom: "2rem",
              maxWidth: "600px",
              margin: "0 auto 2rem",
            }}
          >
            A modern platform for researchers, academics, and curious minds to
            share insights, discoveries, and thought-provoking content with the
            world.
          </p>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              to="/register"
              style={{
                background: "#4f46e5",
                color: "white",
                padding: "12px 24px",
                borderRadius: "8px",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Sparkles size={20} />
              Join Community
            </Link>
            <Link
              to="/blogs"
              style={{
                background: "rgba(255,255,255,0.2)",
                color: "white",
                padding: "12px 24px",
                borderRadius: "8px",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <BookOpen size={20} />
              Explore Blogs
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ paddingTop: "4rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2
            style={{
              textAlign: "center",
              fontSize: "2rem",
              marginBottom: "3rem",
            }}
          >
            Why Choose ResearchBlog?
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "2rem",
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.1)",
                padding: "2rem",
                borderRadius: "12px",
                textAlign: "center",
              }}
            >
              <BookOpen
                size={48}
                style={{ marginBottom: "1rem", color: "#ffd700" }}
              />
              <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
                Rich Content
              </h3>
              <p>
                Share your research with rich formatting, images, and
                interactive elements.
              </p>
            </div>
            <div
              style={{
                background: "rgba(255,255,255,0.1)",
                padding: "2rem",
                borderRadius: "12px",
                textAlign: "center",
              }}
            >
              <Users
                size={48}
                style={{ marginBottom: "1rem", color: "#ffd700" }}
              />
              <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
                Community
              </h3>
              <p>
                Connect with like-minded researchers and academics from around
                the world.
              </p>
            </div>
            <div
              style={{
                background: "rgba(255,255,255,0.1)",
                padding: "2rem",
                borderRadius: "12px",
                textAlign: "center",
              }}
            >
              <Sparkles
                size={48}
                style={{ marginBottom: "1rem", color: "#ffd700" }}
              />
              <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
                AI-Powered
              </h3>
              <p>Get AI assistance for your research and writing process.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SimpleHome;
