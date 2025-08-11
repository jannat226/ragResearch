// client/src/pages/SearchResults.jsx
import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";

const api = import.meta.env.VITE_API_URL;

export default function SearchResults() {
  const [params] = useSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const q = params.get("q") || "";

  useEffect(() => {
    const fetchData = async () => {
      if (!q) return;
      try {
        setLoading(true);
        const { data } = await axios.get(`${api}/api/search`, {
          params: { q },
        });
        setResults(data);
        setError("");
      } catch (e) {
        setError("Search failed");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [q]);

  return (
    <div className="search-container">
      <header className="search-header">
        <h1>Semantic search results</h1>
        <p className="muted">
          Powered by Gemini embeddings + Neo4j vector similarity.
        </p>
        {q && (
          <p className="query">
            Query: <strong>{q}</strong>
          </p>
        )}
      </header>
      {loading && <p>Searching…</p>}
      {error && <p className="error">{error}</p>}
      <div className="search-grid">
        {results.map((b) => (
          <article key={b._id} className="result-card">
            <Link to={`/blogs/${b._id}`} className="title-link">
              <h3>{b.title}</h3>
            </Link>
            <p className="excerpt">{(b.content || "").slice(0, 180)}…</p>
            {b._score !== undefined && (
              <div className="score muted">
                similarity: {b._score.toFixed ? b._score.toFixed(4) : b._score}
              </div>
            )}
          </article>
        ))}
        {!loading && results.length === 0 && q && <p>No results</p>}
      </div>

      <style jsx>{`
        .search-container {
          max-width: 960px;
          margin: 0 auto;
          padding: 1.5rem 1rem;
        }
        .search-header h1 {
          margin: 0;
          font-size: 1.75rem;
        }
        .query {
          margin-top: 0.25rem;
        }
        .search-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
          margin-top: 1rem;
        }
        .result-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 1rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.04);
        }
        .result-card h3 {
          margin: 0 0 0.5rem;
          color: #1f2937;
          font-size: 1.1rem;
        }
        .title-link {
          text-decoration: none;
        }
        .title-link:hover h3 {
          color: #667eea;
        }
        .excerpt {
          color: #4b5563;
          margin: 0 0 0.5rem;
        }
        .score {
          font-size: 0.85rem;
        }
        @media (min-width: 720px) {
          .search-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </div>
  );
}
