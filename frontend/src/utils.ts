export interface StatusOption {
  value: string;
  label: string;
  cls: string;
}

export const STATUS_OPTIONS: StatusOption[] = [
  { value: 'pending',   label: '🟡 Đang chờ',  cls: 'badge-pending' },
  { value: 'win',       label: '🟢 Win',        cls: 'badge-win' },
  { value: 'lose',      label: '🔴 Lose',       cls: 'badge-lose' },
  { value: 'half_win',  label: '🔵 Nửa Win',   cls: 'badge-half_win' },
  { value: 'half_lose', label: '🟠 Nửa Lose',  cls: 'badge-half_lose' },
  { value: 'void',      label: '⚪ Void',       cls: 'badge-void' },
];

export const statusMeta: Record<string, StatusOption> = Object.fromEntries(
  STATUS_OPTIONS.map(s => [s.value, s])
);

export function stars(n: number): string {
  if (typeof n !== 'number') return '☆☆☆☆☆';
  return '⭐'.repeat(Math.max(0, n)) + '☆'.repeat(Math.max(0, 5 - n));
}

export function profitClass(val?: number | null): string {
  if (val === null || val === undefined) return 'profit-neutral';
  return val > 0 ? 'profit-pos' : val < 0 ? 'profit-neg' : 'profit-neutral';
}

export function profitStr(val?: number | null): string {
  if (val === null || val === undefined) return '—';
  return val > 0 ? `+${val}u` : `${val}u`;
}

export function fmtDate(iso: string): string {
  return new Date(iso).toLocaleString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}
