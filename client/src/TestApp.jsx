// Simple test component
import React from "react";

function TestApp() {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontSize: "24px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1>🚀 React is Working!</h1>
        <p>If you can see this, React is rendering correctly</p>
      </div>
    </div>
  );
}

export default TestApp;
