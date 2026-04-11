export interface Bet {
  _id: string;
  league: string;
  match: string;
  bet: string;
  odds: number;
  stake: number;
  confidence: number;
  status: 'pending' | 'win' | 'lose' | 'void' | 'half_win' | 'half_lose';
  profit: number | null;
  sentToDiscord: boolean;
  gameTime: string;
  createdAt: string;
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
