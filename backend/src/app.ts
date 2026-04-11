import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import betRoutes from './routes/betRoutes.js';
import { initCronJobs } from './services/cronService.js';
import { initDiscordBot } from './services/discordNotifier.js';

dotenv.config({ path: '../.env' }); // đọc .env từ root

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ─────────────────────────────────────────────
app.use(cors({ origin: '*' }));
app.use(express.json());

// ── Routes ─────────────────────────────────────────────────
app.use('/api/bets', betRoutes);

app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// ── Boot sequence ──────────────────────────────────────────
async function boot(): Promise<void> {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB connected');

    await initDiscordBot();
    initCronJobs();

    app.listen(PORT, () => {
      console.log(`🚀 Backend running at http://localhost:${PORT}`);
    });
  } catch (err: any) {
    console.error('❌ Boot failed:', err.message);
    process.exit(1);
  }
}

boot();
