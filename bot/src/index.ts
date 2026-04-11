import { Client, GatewayIntentBits, Collection, Message } from 'discord.js';
import dotenv from 'dotenv';
import { verifyCommand } from './commands/verify.js';
import { keoCommand } from './commands/keo.js';
import { statsCommand } from './commands/stats.js';
import express, { Request, Response } from 'express';
import { CommandContext } from './types.js';

dotenv.config({ path: '../.env' }); // đọc .env từ root

// ── Health Check Server (Keep-alive for Render) ──────────────
const app = express();
const PORT = process.env.PORT || 3001;

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', bot: 'online' });
});

app.get('/', (req: Request, res: Response) => {
  res.send('Discord Bot is running!');
});

app.listen(PORT, () => {
  console.log(`📡 Health check server listening on port ${PORT}`);
});

const BIRTHDAY = '21/06/2004';
const ROLE_NAME = 'Verified';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// ── Commands registry ──────────────────────────────────────
const commands = new Collection<string, any>();
commands.set('verify', verifyCommand);
commands.set('keo', keoCommand);
commands.set('stats', statsCommand);

// ── Event: Ready ───────────────────────────────────────────
client.once('ready', () => {
  console.log(`🤖 Bot online: ${client.user?.tag}`);
  client.user?.setActivity('🏀 NBA Kèo Tracker', { type: 3 }); // Watching
});

// ── Event: Message ─────────────────────────────────────────
client.on('messageCreate', async (message: Message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith('!')) return;

  const args = message.content.slice(1).trim().split(/\s+/);
  const commandName = args.shift()?.toLowerCase();
  
  if (!commandName) return;

  const command = commands.get(commandName);
  if (!command) return;

  try {
    const context: CommandContext = { BIRTHDAY, ROLE_NAME, client };
    await command.execute(message, args, context);
  } catch (err: any) {
    console.error(`❌ Error executing !${commandName}:`, err.message);
    message.reply('⚠️ Có lỗi xảy ra, thử lại sau bạn nhé!').catch(() => {});
  }
});

// ── Login ──────────────────────────────────────────────────
client.login(process.env.DISCORD_TOKEN);
