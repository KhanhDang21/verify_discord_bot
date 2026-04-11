import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Dashboard from './pages/Dashboard';
import BetsPage from './pages/BetsPage';

const NAV = [
  { id: 'dashboard', icon: 'fa-chart-line',     label: 'Dashboard' },
  { id: 'bets',      icon: 'fa-basketball',      label: 'Quản lý Kèo' },
];

export default function App() {
  const [page, setPage] = useState<'dashboard' | 'bets'>('dashboard');

  const components: Record<'dashboard' | 'bets', React.ComponentType> = {
    dashboard: Dashboard,
    bets: BetsPage
  };

  const PageComponent = components[page];
  const pageTitle = NAV.find(n => n.id === page)?.label || '';

  return (
    <div className="layout">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-bright)',
          },
        }}
      />

      {/* ── Sidebar ─── */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h1>🏀 NBA Kèo Bot</h1>
          <p>Dashboard v1.0</p>
        </div>

        <nav className="nav-section">
          <div className="nav-label">Menu</div>
          {NAV.map((n) => (
            <button
              key={n.id}
              className={`nav-item ${page === n.id ? 'active' : ''}`}
              onClick={() => setPage(n.id)}
            >
              <i className={`fa-solid ${n.icon}`} />
              {n.label}
            </button>
          ))}
        </nav>

        <div className="nav-section" style={{ marginTop: 'auto' }}>
          <div className="nav-label">Links</div>
          <a
            href="http://localhost:8081"
            target="_blank"
            rel="noreferrer"
            className="nav-item"
            style={{ textDecoration: 'none' }}
          >
            <i className="fa-solid fa-database" />
            Mongo Express
          </a>
          <a
            href="http://localhost:3000/health"
            target="_blank"
            rel="noreferrer"
            className="nav-item"
            style={{ textDecoration: 'none' }}
          >
            <i className="fa-solid fa-heart-pulse" />
            API Health
          </a>
        </div>
      </aside>

      {/* ── Main ─── */}
      <div className="main">
        <header className="topbar">
          <h2>{pageTitle}</h2>
          <div className="topbar-right">
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              <i className="fa-solid fa-circle" style={{ color: 'var(--green)', fontSize: 8, marginRight: 6 }} />
              Live
            </span>
          </div>
        </header>

        <main className="page-content">
          <PageComponent />
        </main>
      </div>
    </div>
  );
}
