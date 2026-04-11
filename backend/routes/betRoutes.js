import express from 'express';
import {
  getBets,
  createBet,
  updateBetStatus,
  deleteBet,
  getStats,
  markAsSent,
} from '../controllers/betController.js';

const router = express.Router();

router.get('/stats', getStats);          // GET  /api/bets/stats
router.get('/', getBets);                // GET  /api/bets?status=pending
router.post('/', createBet);             // POST /api/bets
router.patch('/:id/status', updateBetStatus); // PATCH /api/bets/:id/status
router.patch('/:id/send', markAsSent);   // PATCH /api/bets/:id/send
router.delete('/:id', deleteBet);        // DELETE /api/bets/:id

export default router;
