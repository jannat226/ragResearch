// client/src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../App";
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

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section fade-in">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Welcome to <span className="gradient-text">ResearchBlog</span>
            </h1>
            <p className="hero-subtitle">
              A modern platform for researchers, academics, and curious minds to
              share insights, discoveries, and thought-provoking content with
              the world.
            </p>
            <div className="hero-actions">
              {user ? (
                <>
                  <Link to="/create" className="btn btn-primary btn-lg">
                    <PenTool size={20} />
                    Start Writing
                  </Link>
                  <Link to="/blogs" className="btn btn-secondary btn-lg">
                    <BookOpen size={20} />
                    Explore Blogs
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary btn-lg">
                    <Sparkles size={20} />
                    Join Community
                  </Link>
                  <Link to="/blogs" className="btn btn-secondary btn-lg">
                    <BookOpen size={20} />
                    Read Blogs
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="hero-visual">
            <div className="floating-card card-1">
              <BookOpen size={24} />
              <span>Share Knowledge</span>
            </div>
            <div className="floating-card card-2">
              <Users size={24} />
              <span>Build Community</span>
            </div>
            <div className="floating-card card-3">
              <Heart size={24} />
              <span>Inspire Others</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">Why Choose ResearchBlog?</h2>
          <p className="section-subtitle">
            Everything you need to share your research and connect with
            like-minded individuals
          </p>
        </div>

        <div className="features-grid">
          <FeatureCard
            icon={<PenTool size={32} />}
            title="Easy Writing"
            description="Intuitive editor with preview mode to help you craft perfect blog posts with ease."
            color="blue"
          />
          <FeatureCard
            icon={<Users size={32} />}
            title="Vibrant Community"
            description="Connect with researchers, academics, and curious minds from around the globe."
            color="green"
          />
          <FeatureCard
            icon={<Target size={32} />}
            title="Research Focused"
            description="Designed specifically for sharing research insights, findings, and academic thoughts."
            color="purple"
          />
          <FeatureCard
            icon={<Zap size={32} />}
            title="Fast & Modern"
            description="Lightning-fast performance with a beautiful, responsive design that works everywhere."
            color="orange"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Share Your Research?</h2>
          <p className="cta-description">
            Join thousands of researchers and academics who are already sharing
            their insights on ResearchBlog.
          </p>
          {user ? (
            <Link to="/create" className="btn btn-primary btn-lg">
              <PenTool size={20} />
              Write Your First Post
              <ArrowRight size={20} />
            </Link>
          ) : (
            <div className="cta-actions">
              <Link to="/register" className="btn btn-primary btn-lg">
                <Sparkles size={20} />
                Get Started Free
              </Link>
              <Link to="/login" className="btn btn-ghost btn-lg">
                Already have an account?
              </Link>
            </div>
          )}
        </div>
      </section>

      <style jsx>{`
        .home-container {
          min-height: calc(100vh - 80px);
        }

        /* Hero Section */
        .hero-section {
          padding: 4rem 0 6rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          position: relative;
          overflow: hidden;
        }

        .hero-section::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><defs><radialGradient id="a" cx="50%" cy="50%"><stop offset="0%" stop-opacity=".1"/><stop offset="100%" stop-opacity="0"/></radialGradient></defs><circle cx="50%" cy="50%" r="50%" fill="url(%23a)"/></svg>')
            center/cover;
          opacity: 0.1;
        }

        .hero-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 4rem;
          position: relative;
          z-index: 1;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 1.5rem;
        }

        .gradient-text {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          line-height: 1.6;
          margin-bottom: 2.5rem;
          opacity: 0.9;
        }

        .hero-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .btn-lg {
          padding: 1rem 2rem;
          font-size: 1.1rem;
        }

        /* Hero Visual */
        .hero-visual {
          position: relative;
          height: 400px;
        }

        .floating-card {
          position: absolute;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          color: #2d3748;
          font-weight: 600;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          animation: float 6s ease-in-out infinite;
        }

        .card-1 {
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }

        .card-2 {
          top: 50%;
          right: 10%;
          animation-delay: 2s;
        }

        .card-3 {
          bottom: 20%;
          left: 20%;
          animation-delay: 4s;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        /* Features Section */
        .features-section {
          padding: 6rem 0;
          background: white;
        }

        .section-header {
          text-align: center;
          max-width: 600px;
          margin: 0 auto 4rem;
          padding: 0 2rem;
        }

        .section-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 1rem;
        }

        .section-subtitle {
          font-size: 1.1rem;
          color: #718096;
          line-height: 1.6;
        }

        .features-grid {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
        }

        /* CTA Section */
        .cta-section {
          padding: 6rem 0;
          background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
          text-align: center;
        }

        .cta-content {
          max-width: 600px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .cta-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 1rem;
        }

        .cta-description {
          font-size: 1.1rem;
          color: #718096;
          line-height: 1.6;
          margin-bottom: 2.5rem;
        }

        .cta-actions {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .hero-content {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 3rem;
          }

          .hero-title {
            font-size: 2.5rem;
          }

          .hero-visual {
            height: 300px;
          }

          .floating-card {
            padding: 1rem;
            font-size: 0.9rem;
          }

          .section-title,
          .cta-title {
            font-size: 2rem;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .hero-actions,
          .cta-actions {
            flex-direction: column;
            align-items: center;
          }

          .btn-lg {
            width: 100%;
            max-width: 300px;
          }
        }
      `}</style>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description, color }) => {
  const colorClasses = {
    blue: "feature-blue",
    green: "feature-green",
    purple: "feature-purple",
    orange: "feature-orange",
  };

  return (
    <div className={`feature-card ${colorClasses[color]}`}>
      <div className="feature-icon">{icon}</div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>

      <style jsx>{`
        .feature-card {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          text-align: center;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          border: 1px solid #f7fafc;
        }

        .feature-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
        }

        .feature-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          color: white;
        }

        .feature-blue .feature-icon {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .feature-green .feature-icon {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }

        .feature-purple .feature-icon {
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
        }

        .feature-orange .feature-icon {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        }

        .feature-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 1rem;
        }

        .feature-description {
          color: #718096;
          line-height: 1.6;
          margin: 0;
        }
      `}</style>
    </div>
  );
};

export default Home;
