import axios from 'axios';
import { Bet, Stats } from './types.js';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({ baseURL: BASE });

export const fetchStats = (): Promise<Stats> => 
  api.get('/api/bets/stats').then(r => r.data.data);

export const fetchBets = (status: string = ''): Promise<Bet[]> => 
  api.get(`/api/bets${status ? `?status=${status}` : ''}&limit=100`).then(r => r.data.data);

export const createBet = (data: Partial<Bet>): Promise<any> => 
  api.post('/api/bets', data).then(r => r.data);

export const updateStatus = (id: string, status: string): Promise<any> => 
  api.patch(`/api/bets/${id}/status`, { status }).then(r => r.data);

export const deleteBet = (id: string): Promise<any> => 
  api.delete(`/api/bets/${id}`).then(r => r.data);
