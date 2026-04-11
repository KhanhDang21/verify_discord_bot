import { Request, Response } from 'express';
import Bet from '../models/Bet.js';

// ─── GET /api/bets ──────────────────────────────────────────
// lấy danh sách kèo, hỗ trợ filter theo status
export const getBets = async (req: Request, res: Response) => {
  try {
    const { status, limit = 50 } = req.query;
    const filter = status ? { status } : {};
    const bets = await Bet.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit));
    res.json({ success: true, data: bets });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── POST /api/bets ─────────────────────────────────────────
// thêm kèo mới
export const createBet = async (req: Request, res: Response) => {
  try {
    const bet = new Bet(req.body);
    await bet.save();
    res.status(201).json({ success: true, data: bet, message: '🔥 Kèo đã được thêm!' });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ─── PATCH /api/bets/:id/status ─────────────────────────────
// update kết quả kèo (win/lose/void...)
export const updateBetStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const bet = await Bet.findById(req.params.id);
    if (!bet) return res.status(404).json({ success: false, message: 'Không tìm thấy kèo' });

    bet.status = status;
    await bet.save(); // pre-save hook tự tính profit
    res.json({ success: true, data: bet, message: `✅ Kèo đã được cập nhật: ${status.toUpperCase()}` });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ─── DELETE /api/bets/:id ───────────────────────────────────
export const deleteBet = async (req: Request, res: Response) => {
  try {
    const bet = await Bet.findByIdAndDelete(req.params.id);
    if (!bet) return res.status(404).json({ success: false, message: 'Không tìm thấy kèo' });
    res.json({ success: true, message: '🗑️ Kèo đã xoá' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET /api/bets/stats ────────────────────────────────────
// thống kê tổng: winrate, ROI, profit
export const getStats = async (req: Request, res: Response) => {
  try {
    const all = await Bet.find({ status: { $ne: 'pending' } });
    const wins = all.filter((b) => b.status === 'win' || b.status === 'half_win');
    const loses = all.filter((b) => b.status === 'lose' || b.status === 'half_lose');
    const voids = all.filter((b) => b.status === 'void');
    const totalProfit = all.reduce((sum, b) => sum + (b.profit || 0), 0);
    const totalStake = all
      .filter((b) => b.status !== 'void')
      .reduce((sum, b) => sum + b.stake, 0);

    const winrate = all.length > 0 ? ((wins.length / (all.length - voids.length)) * 100).toFixed(1) : 0;
    const roi = totalStake > 0 ? ((totalProfit / totalStake) * 100).toFixed(1) : 0;

    res.json({
      success: true,
      data: {
        total: all.length,
        wins: wins.length,
        loses: loses.length,
        voids: voids.length,
        winrate: `${winrate}%`,
        roi: `${roi}%`,
        totalProfit: +totalProfit.toFixed(2),
        pending: await Bet.countDocuments({ status: 'pending' }),
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── PATCH /api/bets/:id/send ───────────────────────────────
// đánh dấu kèo đã gửi Discord (internal use)
export const markAsSent = async (req: Request, res: Response) => {
  try {
    const bet = await Bet.findByIdAndUpdate(
      req.params.id,
      { sentToDiscord: true },
      { new: true }
    );
    res.json({ success: true, data: bet });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
