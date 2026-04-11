import { Client, GatewayIntentBits, Collection } from 'discord.js';
import dotenv from 'dotenv';
import { verifyCommand } from './commands/verify.js';
import { keoCommand } from './commands/keo.js';
import { statsCommand } from './commands/stats.js';

dotenv.config({ path: '../.env' }); // đọc .env từ root

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
const commands = new Collection();
commands.set('verify', verifyCommand);
commands.set('keo', keoCommand);
commands.set('stats', statsCommand);

// ── Event: Ready ───────────────────────────────────────────
client.once('ready', () => {
  console.log(`🤖 Bot online: ${client.user.tag}`);
  client.user.setActivity('🏀 NBA Kèo Tracker', { type: 3 }); // Watching
});

// ── Event: Message ─────────────────────────────────────────
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith('!')) return;

  const args = message.content.slice(1).trim().split(/\s+/);
  const commandName = args.shift().toLowerCase();

  const command = commands.get(commandName);
  if (!command) return;

  try {
    await command.execute(message, args, { BIRTHDAY, ROLE_NAME, client });
  } catch (err) {
    console.error(`❌ Error executing !${commandName}:`, err.message);
    message.reply('⚠️ Có lỗi xảy ra, thử lại sau bạn nhé!').catch(() => {});
  }
});

// ── Login ──────────────────────────────────────────────────
client.login(process.env.DISCORD_TOKEN);
