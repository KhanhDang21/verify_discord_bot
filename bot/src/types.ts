import { Message, Client } from 'discord.js';

export interface CommandContext {
  BIRTHDAY: string;
  ROLE_NAME: string;
  client: Client;
}

export interface Bet {
  _id: string;
  league: string;
  match: string;
  bet: string;
  odds: number;
  stake: number;
  confidence: number;
  status: 'pending' | 'win' | 'lose' | 'void' | 'half_win' | 'half_lose';
  createdAt: string;
  gameTime?: string;
}

export interface Stats {
  total: number;
  wins: number;
  loses: number;
  voids: number;
  winrate: string;
  roi: string;
  totalProfit: number;
  pending: number;
}
