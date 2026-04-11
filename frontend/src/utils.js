export const STATUS_OPTIONS = [
  { value: 'pending',   label: '🟡 Đang chờ',  cls: 'badge-pending' },
  { value: 'win',       label: '🟢 Win',        cls: 'badge-win' },
  { value: 'lose',      label: '🔴 Lose',       cls: 'badge-lose' },
  { value: 'half_win',  label: '🔵 Nửa Win',   cls: 'badge-half_win' },
  { value: 'half_lose', label: '🟠 Nửa Lose',  cls: 'badge-half_lose' },
  { value: 'void',      label: '⚪ Void',       cls: 'badge-void' },
];

export const statusMeta = Object.fromEntries(STATUS_OPTIONS.map(s => [s.value, s]));

export function stars(n) {
  return '⭐'.repeat(n) + '☆'.repeat(5 - n);
}

export function profitClass(val) {
  if (val === null || val === undefined) return 'profit-neutral';
  return val > 0 ? 'profit-pos' : val < 0 ? 'profit-neg' : 'profit-neutral';
}

export function profitStr(val) {
  if (val === null || val === undefined) return '—';
  return val > 0 ? `+${val}u` : `${val}u`;
}

export function fmtDate(iso) {
  return new Date(iso).toLocaleString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}
