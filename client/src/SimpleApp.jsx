// Simplified App.jsx for debugging
import React, { useState, useEffect, createContext, useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Try importing the simple Home component
import SimpleHome from "./pages/SimpleHome";

// Create Auth Context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const TestLogin = () => (
  <div style={{ padding: "2rem", textAlign: "center" }}>
    <h1>Login Page</h1>
    <p>Login functionality</p>
  </div>
);

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simple loading simulation
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const login = (userData, token) => {
    setUser(userData);
  };

  const logout = () => {
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
          fontSize: "18px",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <Router>
        <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
          <nav
            style={{ background: "#667eea", padding: "1rem", color: "white" }}
          >
            <h2>ResearchBlog</h2>
          </nav>
          <main>
            <Routes>
              <Route path="/" element={<SimpleHome />} />
              <Route path="/login" element={<TestLogin />} />
              <Route path="/test" element={<div>Test Route Works!</div>} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
