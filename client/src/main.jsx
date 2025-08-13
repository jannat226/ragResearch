import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import WorkingApp from "./WorkingApp.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <WorkingApp />
  </StrictMode>
);
