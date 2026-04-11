import { useState, useEffect } from 'react';
import { fetchBets, updateStatus, deleteBet } from '../api.js';
import { statusMeta, stars, profitClass, profitStr, fmtDate, STATUS_OPTIONS } from '../utils.js';
import AddBetModal from '../components/AddBetModal.jsx';
import toast from 'react-hot-toast';

export default function BetsPage() {
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const load = (f = filter) => {
    setLoading(true);
    fetchBets(f)
      .then(setBets)
      .catch(() => toast.error('Lỗi tải danh sách kèo'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id);
    try {
      await updateStatus(id, status);
      toast.success(`✅ Đã cập nhật: ${statusMeta[status]?.label || status}`);
      load();
    } catch {
      toast.error('Lỗi cập nhật trạng thái');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id, match) => {
    if (!confirm(`Xoá kèo "${match}"?`)) return;
    try {
      await deleteBet(id);
      toast.success('🗑️ Đã xoá kèo');
      load();
    } catch {
      toast.error('Lỗi xoá kèo');
    }
  };

  const handleFilter = (f) => {
    setFilter(f);
    load(f);
  };

  return (
    <div className="fade-in">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">📋 Danh sách kèo</h3>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Filter tabs */}
            <div style={{ display: 'flex', gap: 6 }}>
              {[{ v: '', l: 'Tất cả' }, ...STATUS_OPTIONS.map(s => ({ v: s.value, l: s.label }))].map(({ v, l }) => (
                <button
                  key={v}
                  className={`btn btn-sm ${filter === v ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => handleFilter(v)}
                >
                  {l}
                </button>
              ))}
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}>
              <i className="fa-solid fa-plus" /> Thêm kèo
            </button>
          </div>
        </div>

        {loading ? (
          <div className="spinner" />
        ) : bets.length === 0 ? (
          <div className="empty-state">
            <i className="fa-solid fa-basketball" />
            <h3>Chưa có kèo nào</h3>
            <p>Nhấn "Thêm kèo" để bắt đầu tracking!</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Trận</th>
                  <th>Kèo</th>
                  <th>Tỷ lệ</th>
                  <th>Stake</th>
                  <th>Tự tin</th>
                  <th>Trạng thái</th>
                  <th>Profit</th>
                  <th>Ngày tạo</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {bets.map((bet) => {
                  const sm = statusMeta[bet.status];
                  return (
                    <tr key={bet._id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{bet.match}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                          {bet.league} {bet.gameTime && `· ${bet.gameTime}`}
                        </div>
                      </td>
                      <td style={{ maxWidth: 180 }}>
                        <div>{bet.bet}</div>
                        {bet.note && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{bet.note}</div>}
                      </td>
                      <td style={{ fontWeight: 700 }}>{bet.odds}</td>
                      <td>{bet.stake}u</td>
                      <td><span className="stars">{stars(bet.confidence)}</span></td>
                      <td>
                        <select
                          className={`badge ${sm?.cls}`}
                          value={bet.status}
                          onChange={(e) => handleStatusChange(bet._id, e.target.value)}
                          disabled={updatingId === bet._id}
                          style={{ cursor: 'pointer', border: 'none', outline: 'none', background: 'transparent' }}
                        >
                          {STATUS_OPTIONS.map(s => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                          ))}
                        </select>
                      </td>
                      <td className={profitClass(bet.profit)}>{profitStr(bet.profit)}</td>
                      <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{fmtDate(bet.createdAt)}</td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(bet._id, bet.match)}
                          title="Xoá kèo"
                        >
                          <i className="fa-solid fa-trash" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showAdd && (
        <AddBetModal onClose={() => setShowAdd(false)} onCreated={() => load()} />
      )}
    </div>
  );
}
