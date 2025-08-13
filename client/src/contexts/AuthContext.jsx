// client/src/contexts/AuthContext.jsx
import React, { createContext, useContext } from "react";

// Create Auth Context
export const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
