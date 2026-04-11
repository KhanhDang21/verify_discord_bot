import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({ baseURL: BASE });

export const fetchStats = () => api.get('/api/bets/stats').then(r => r.data.data);
export const fetchBets = (status = '') => api.get(`/api/bets${status ? `?status=${status}` : ''}&limit=100`).then(r => r.data.data);
export const createBet = (data) => api.post('/api/bets', data).then(r => r.data);
export const updateStatus = (id, status) => api.patch(`/api/bets/${id}/status`, { status }).then(r => r.data);
export const deleteBet = (id) => api.delete(`/api/bets/${id}`).then(r => r.data);
