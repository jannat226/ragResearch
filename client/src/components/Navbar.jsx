// client/src/components/Navbar.jsx
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  PenTool,
  BookOpen,
  Home,
  LogIn,
  UserPlus,
  LogOut,
  User,
  Menu,
  X,
  Search as SearchIcon,
  Bot,
} from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState("");

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (path) => location.pathname === path;

  const submitSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link
          to="/"
          className="navbar-logo"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <BookOpen size={28} />
          <span>ResearchBlog</span>
        </Link>

        {/* Desktop Menu */}
        <div className="navbar-menu desktop-menu">
          <NavLink to="/blogs" icon={BookOpen} active={isActive("/blogs")}>
            Blogs
          </NavLink>
          <NavLink to="/ask" icon={Bot} active={isActive("/ask")}>
            Ask AI
          </NavLink>

          {/* Search */}
          <form className="nav-search" onSubmit={submitSearch}>
            <SearchIcon size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles..."
              aria-label="Search articles"
            />
          </form>

          {user ? (
            <>
              <NavLink to="/create" icon={PenTool} active={isActive("/create")}>
                Write
              </NavLink>
              <div className="navbar-user">
                <div className="user-info">
                  <User size={20} />
                  <span>{user.username}</span>
                </div>
                <button onClick={handleLogout} className="btn btn-ghost btn-sm">
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="navbar-auth">
              <NavLink to="/login" icon={LogIn} active={isActive("/login")}>
                Login
              </NavLink>
              <NavLink
                to="/register"
                icon={UserPlus}
                active={isActive("/register")}
                className="btn btn-primary btn-sm"
              >
                Sign Up
              </NavLink>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-content">
            <form className="nav-search mobile" onSubmit={submitSearch}>
              <SearchIcon size={18} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles..."
                aria-label="Search articles"
              />
            </form>
            {/* Removed Home link; logo is Home across breakpoints */}
            <MobileNavLink
              to="/blogs"
              icon={BookOpen}
              active={isActive("/blogs")}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Blogs
            </MobileNavLink>
            <MobileNavLink
              to="/ask"
              icon={Bot}
              active={isActive("/ask")}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Ask AI
            </MobileNavLink>

            {user ? (
              <>
                <MobileNavLink
                  to="/create"
                  icon={PenTool}
                  active={isActive("/create")}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Write
                </MobileNavLink>
                <div className="mobile-user-info">
                  <div className="user-avatar">
                    <User size={20} />
                    <span>{user.username}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="btn btn-danger btn-sm w-full"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <MobileNavLink
                  to="/login"
                  icon={LogIn}
                  active={isActive("/login")}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </MobileNavLink>
                <Link
                  to="/register"
                  className="btn btn-primary w-full"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <UserPlus size={16} />
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .navbar {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .navbar-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1rem 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .navbar-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.5rem;
          font-weight: 700;
          color: #667eea;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .navbar-logo:hover {
          transform: scale(1.05);
        }

        .navbar-menu {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .desktop-menu {
          display: flex;
        }

        .navbar-auth {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .navbar-user {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(102, 126, 234, 0.1);
          border-radius: 50px;
          color: #667eea;
          font-weight: 600;
        }

        .mobile-menu-toggle {
          display: none;
          background: none;
          border: none;
          color: #667eea;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .mobile-menu-toggle:hover {
          background: rgba(102, 126, 234, 0.1);
        }

        .mobile-menu {
          display: none;
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .mobile-menu-content {
          padding: 1.5rem 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .mobile-user-info {
          padding-top: 1rem;
          border-top: 1px solid #e5e7eb;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .user-avatar {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #667eea;
          font-weight: 600;
        }

        .nav-search {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.25rem 0.75rem;
          border: 1px solid #e5e7eb;
          border-radius: 9999px;
          background: #fff;
        }
        .nav-search input {
          border: none;
          outline: none;
          width: 200px;
        }
        .nav-search.mobile {
          width: 100%;
        }

        @media (max-width: 768px) {
          .desktop-menu {
            display: none;
          }

          .mobile-menu-toggle {
            display: block;
          }

          .mobile-menu {
            display: block;
          }

          .navbar-container {
            padding: 1rem;
          }
        }
      `}</style>
    </nav>
  );
};

// NavLink component for desktop
const NavLink = ({ to, icon: Icon, children, active, className = "" }) => (
  <Link to={to} className={`nav-link ${active ? "active" : ""} ${className}`}>
    <Icon size={18} />
    <span>{children}</span>
    <style jsx>{`
      .nav-link {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        border-radius: 50px;
        text-decoration: none;
        color: #718096;
        font-weight: 500;
        transition: all 0.3s ease;
        border: 2px solid transparent;
      }

      .nav-link:hover,
      .nav-link.active {
        color: #667eea;
        background: rgba(102, 126, 234, 0.1);
        transform: translateY(-1px);
      }

      .nav-link.active {
        font-weight: 600;
      }
    `}</style>
  </Link>
);

// MobileNavLink component
const MobileNavLink = ({ to, icon: Icon, children, active, onClick }) => (
  <Link
    to={to}
    className={`mobile-nav-link ${active ? "active" : ""}`}
    onClick={onClick}
  >
    <Icon size={20} />
    <span>{children}</span>
    <style jsx>{`
      .mobile-nav-link {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        border-radius: 12px;
        text-decoration: none;
        color: #718096;
        font-weight: 500;
        transition: all 0.3s ease;
      }

      .mobile-nav-link:hover,
      .mobile-nav-link.active {
        color: #667eea;
        background: rgba(102, 126, 234, 0.1);
      }

      .mobile-nav-link.active {
        font-weight: 600;
      }
    `}</style>
  </Link>
);

export default Navbar;
