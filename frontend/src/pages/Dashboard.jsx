import { useState, useEffect } from 'react';
import { fetchStats } from '../api.js';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetchStats()
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  if (loading) return <div className="spinner" />;

  if (!stats) {
    return (
      <div className="empty-state fade-in">
        <i className="fa-solid fa-plug-circle-bolt" />
        <h3>Không kết nối được Backend</h3>
        <p>Đảm bảo backend đang chạy tại <code>http://localhost:3000</code></p>
      </div>
    );
  }

  const cards = [
    {
      icon: '📈', label: 'Winrate', value: stats.winrate,
      accent: '#23d18b', iconBg: 'rgba(35,209,139,0.12)',
    },
    {
      icon: '💰', label: 'ROI', value: stats.roi,
      accent: '#5865f2', iconBg: 'rgba(88,101,242,0.12)',
    },
    {
      icon: '💵', label: 'Tổng Profit', value: `${stats.totalProfit > 0 ? '+' : ''}${stats.totalProfit}u`,
      accent: stats.totalProfit >= 0 ? '#23d18b' : '#f04747',
      iconBg: 'rgba(250,166,26,0.12)',
    },
    {
      icon: '✅', label: 'Thắng', value: stats.wins,
      accent: '#23d18b', iconBg: 'rgba(35,209,139,0.12)',
    },
    {
      icon: '❌', label: 'Thua', value: stats.loses,
      accent: '#f04747', iconBg: 'rgba(240,71,71,0.12)',
    },
    {
      icon: '⚪', label: 'Void', value: stats.voids,
      accent: '#6b7280', iconBg: 'rgba(107,114,128,0.12)',
    },
    {
      icon: '🟡', label: 'Đang chờ', value: stats.pending,
      accent: '#faa61a', iconBg: 'rgba(250,166,26,0.12)',
    },
    {
      icon: '📋', label: 'Tổng giải', value: stats.total,
      accent: '#4fa3e3', iconBg: 'rgba(79,163,227,0.12)',
    },
  ];

  return (
    <div className="fade-in">
      <div className="stats-grid">
        {cards.map((c) => (
          <div
            className="stat-card"
            key={c.label}
            style={{ '--accent-color': c.accent, '--icon-bg': c.iconBg }}
          >
            <div className="stat-icon">{c.icon}</div>
            <div className="stat-value">{c.value}</div>
            <div className="stat-label">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">📊 Tổng quan</h3>
          <button className="btn btn-ghost btn-sm" onClick={load}>
            <i className="fa-solid fa-rotate-right" /> Refresh
          </button>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          Bắt đầu thêm kèo từ trang <strong>Quản lý Kèo</strong> hoặc qua Discord command{' '}
          <code style={{ color: 'var(--accent)' }}>!keo</code>. Cron job sẽ tự gửi kèo pending{' '}
          lên Discord lúc <strong>8:00</strong> và <strong>18:00</strong> mỗi ngày.
        </p>
      </div>
    </div>
  );
}
