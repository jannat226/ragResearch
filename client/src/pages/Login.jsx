// client/src/pages/Login.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../App";
import axios from "axios";

const api = import.meta.env.VITE_API_URL;
import { LogIn, Mail, Lock, Eye, EyeOff } from "lucide-react";

const Login = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${api}/api/auth/login`, formData);
      login(response.data.user, response.data.token);
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container fade-in">
      <div className="form-container">
        <div className="card">
          <div className="card-header text-center">
            <div className="login-icon">
              <LogIn size={40} />
            </div>
            <h1 className="card-title">Welcome Back</h1>
            <p className="card-subtitle">Sign in to your account to continue</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <Mail size={16} />
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                <Lock size={16} />
                Password
              </label>
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="loading-spinner-sm"></div>
                  Signing In...
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  Sign In
                </>
              )}
            </button>
            <div className="text-center mt-4">
              <a href="/forgot-password" className="link">
                Forgot password?
              </a>
            </div>
          </form>

          <div className="form-footer">
            <p>
              Don't have an account?{" "}
              <Link to="/register" className="link">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .login-container {
          min-height: calc(100vh - 80px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
        }

        .login-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          margin: 0 auto 1.5rem;
          box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
        }

        .form-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .password-input-container {
          position: relative;
        }

        .password-toggle {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #718096;
          cursor: pointer;
          padding: 0.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.3s ease;
        }

        .password-toggle:hover {
          color: #667eea;
        }

        .loading-spinner-sm {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .form-footer {
          text-align: center;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid #e5e7eb;
          color: #718096;
        }

        .link {
          color: #667eea;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .link:hover {
          text-decoration: underline;
          color: #5a6fd8;
        }

        /* Responsive adjustments */
        @media (max-width: 480px) {
          .login-container {
            padding: 1rem;
          }

          .login-icon {
            width: 64px;
            height: 64px;
          }

          .form-container {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
