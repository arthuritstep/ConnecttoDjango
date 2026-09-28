import { useEffect, useState } from "react";

type HealthResponse = {
  status: string;
  service: string;
};

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${apiUrl}/api/health/`)
      .then((response) => {
        if (!response.ok) throw new Error("API returned an error");
        return response.json() as Promise<HealthResponse>;
      })
      .then(setHealth)
      .catch((requestError: Error) => setError(requestError.message));
  }, []);

  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">FULL-STACK STARTER / 001</p>
        <h1>Django meets React.</h1>
        <p className="lede">
          A clean starting point for products that need a Python API, a real database,
          and a fast TypeScript interface.
        </p>
        <div className="stack-list" aria-label="Technology stack">
          <span>Django</span>
          <span>PostgreSQL</span>
          <span>Docker</span>
          <span>Vite + TS</span>
        </div>
      </section>

      <aside className="status-panel">
        <div className="status-heading">
          <span className={`status-dot ${health ? "online" : error ? "offline" : "pending"}`} />
          <span>API status</span>
        </div>
        <strong>{health ? "Connected" : error ? "Unavailable" : "Checking..."}</strong>
        <p>{health ? `${health.service} answered with ${health.status}.` : error ?? "Waiting for Django..."}</p>
        <code>GET /api/health/</code>
      </aside>
    </main>
  );
}

export default App;
