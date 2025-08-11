// client/src/pages/AskAI.jsx
import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const api = import.meta.env.VITE_API_URL;

export default function AskAI() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);

  const ask = async (e) => {
    e.preventDefault();
    const q = question.trim();
    if (!q) return;
    try {
      setLoading(true);
      setError("");
      setAnswer("");
      setSources([]);
      const { data } = await axios.post(`${api}/api/ask`, {
        question: q,
        k: 8,
      });
      setAnswer(data.answer || "");
      setSources(data.sources || []);
    } catch (e) {
      setError("Failed to get AI answer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="askai-container">
      <header className="askai-header">
        <h1>Ask AI</h1>
        <p className="muted">
          Ask questions across all posts. We’ll include links to relevant
          papers.
        </p>
      </header>

      <form onSubmit={ask} className="ask-form">
        <textarea
          rows={3}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask anything about the content…"
        />
        <div className="ask-actions">
          <button className="btn btn-primary" disabled={loading}>
            {loading ? "Asking…" : "Ask"}
          </button>
        </div>
      </form>

      {error && <p className="error mt-12">{error}</p>}

      {answer && (
        <section className="answer-card">
          <h3>Answer</h3>
          <p>{answer}</p>

          {sources?.length > 0 && (
            <div className="sources">
              <h4>Sources</h4>
              <ul>
                {sources.map((s) => (
                  <li key={s.blogId}>
                    <Link to={`/blogs/${s.blogId}`}>
                      {s.title || "View paper"}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      <style jsx>{`
        .askai-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 1.5rem 1rem;
        }
        .askai-header h1 {
          margin: 0;
          font-size: 1.75rem;
        }
        .muted {
          color: #6b7280;
        }
        .ask-form {
          display: grid;
          gap: 0.75rem;
          margin-top: 1rem;
        }
        .ask-form textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
        }
        .ask-actions {
          display: flex;
          justify-content: flex-end;
        }
        .answer-card {
          margin-top: 1rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 1rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.04);
        }
        .answer-card h3 {
          margin: 0 0 0.5rem;
          font-size: 1.1rem;
        }
        .sources {
          margin-top: 0.75rem;
        }
        .sources h4 {
          margin: 0 0 0.25rem;
          font-size: 1rem;
        }
        .sources ul {
          margin: 0;
          padding-left: 1.25rem;
        }
        .sources a {
          color: #667eea;
          text-decoration: none;
        }
        .sources a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
