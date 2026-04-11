import { useState, ChangeEvent, FormEvent } from 'react';
import { createBet } from '../api';
import toast from 'react-hot-toast';

const LEAGUES = ['NBA', 'NCAA', 'Euroleague', 'G-League', 'Khác'];

interface FormData {
  league: string;
  match: string;
  bet: string;
  odds: string;
  stake: string;
  confidence: string;
  note: string;
  gameTime: string;
}

const DEFAULT: FormData = {
  league: 'NBA', match: '', bet: '', odds: '', stake: '1',
  confidence: '3', note: '', gameTime: '',
};

interface AddBetModalProps {
  onClose: () => void;
  onCreated: () => void;
}

export default function AddBetModal({ onClose, onCreated }: AddBetModalProps) {
  const [form, setForm] = useState<FormData>(DEFAULT);
  const [loading, setLoading] = useState(false);

  const set = (k: keyof FormData) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => 
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.match || !form.bet || !form.odds) {
      return toast.error('Vui lòng điền đầy đủ thông tin bắt buộc!');
    }
    setLoading(true);
    try {
      await createBet({
        ...form,
        odds: parseFloat(form.odds),
        stake: parseFloat(form.stake),
        confidence: parseInt(form.confidence),
      });
      toast.success('🔥 Kèo đã được thêm thành công!');
      onCreated?.();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Lỗi khi thêm kèo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3 className="modal-title">🔥 Thêm kèo mới</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Giải đấu</label>
              <select value={form.league} onChange={set('league')}>
                {LEAGUES.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Giờ đấu</label>
              <input placeholder="VD: 09:00" value={form.gameTime} onChange={set('gameTime')} />
            </div>

            <div className="form-group full">
              <label>Trận đấu *</label>
              <input required placeholder="VD: Lakers vs Celtics" value={form.match} onChange={set('match')} />
            </div>

            <div className="form-group full">
              <label>Kèo cược *</label>
              <input required placeholder="VD: Lakers -5.5 | Over 224.5 | Celtics ML" value={form.bet} onChange={set('bet')} />
            </div>

            <div className="form-group">
              <label>Tỷ lệ kèo *</label>
              <input required type="number" step="0.01" min="1" placeholder="VD: 1.90" value={form.odds} onChange={set('odds')} />
            </div>

            <div className="form-group">
              <label>Stake (đơn vị)</label>
              <input type="number" step="0.5" min="0.5" placeholder="1" value={form.stake} onChange={set('stake')} />
            </div>

            <div className="form-group">
              <label>Độ tự tin (1-5 ⭐)</label>
              <select value={form.confidence} onChange={set('confidence')}>
                {[1,2,3,4,5].map(n => (
                  <option key={n} value={n}>{n} {'⭐'.repeat(n)}</option>
                ))}
              </select>
            </div>

            <div className="form-group full">
              <label>Ghi chú</label>
              <textarea placeholder="Lý do chọn kèo này..." value={form.note} onChange={set('note')} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Huỷ</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <><i className="fa-solid fa-spinner fa-spin" /> Đang lưu...</> : <><i className="fa-solid fa-plus" /> Thêm kèo</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
