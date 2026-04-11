import { EmbedBuilder } from 'discord.js';
import Bet from '../models/Bet.js';

// Được gọi từ bot để lấy embed cho 1 kèo
export function buildKeoEmbed(bet) {
  const confidenceStars = '⭐'.repeat(bet.confidence) + '☆'.repeat(5 - bet.confidence);
  const statusEmoji = {
    pending: '🟡',
    win: '🟢',
    lose: '🔴',
    void: '⚪',
    half_win: '🔵',
    half_lose: '🟠',
  }[bet.status] || '🟡';

  return new EmbedBuilder()
    .setColor(0x5865f2) // Discord Blurple
    .setTitle('🔥 KÈO NBA NGON')
    .setDescription(`> **${bet.match}**`)
    .addFields(
      { name: '🎯 Cược', value: bet.bet, inline: true },
      { name: '💰 Kèo', value: `${bet.odds}`, inline: true },
      { name: '📦 Stake', value: `${bet.stake}u`, inline: true },
      { name: '⭐ Độ tự tin', value: confidenceStars, inline: true },
      { name: '🏆 Giải', value: bet.league || 'NBA', inline: true },
      { name: '⏰ Giờ đấu', value: bet.gameTime || 'TBD', inline: true },
      ...(bet.note ? [{ name: '📝 Ghi chú', value: bet.note, inline: false }] : []),
      { name: 'Trạng thái', value: `${statusEmoji} ${bet.status.toUpperCase()}`, inline: true }
    )
    .setFooter({ text: `ID: ${bet._id}` })
    .setTimestamp();
}

// Gửi tất cả kèo pending chưa gửi lên Discord channel
export async function sendPendingBets(client) {
  const channelId = process.env.KEO_CHANNEL_ID;
  if (!channelId) {
    console.warn('⚠️  KEO_CHANNEL_ID chưa set trong .env — bỏ qua auto-send');
    return;
  }

  const channel = await client.channels.fetch(channelId).catch(() => null);
  if (!channel) {
    console.error('❌ Không tìm thấy channel:', channelId);
    return;
  }

  const pendingBets = await Bet.find({ status: 'pending', sentToDiscord: false });
  if (pendingBets.length === 0) {
    console.log('✅ Không có kèo mới để gửi');
    return;
  }

  for (const bet of pendingBets) {
    const embed = buildKeoEmbed(bet);
    await channel.send({ embeds: [embed] });
    bet.sentToDiscord = true;
    await bet.save();
    console.log(`📤 Đã gửi kèo: ${bet.match}`);
  }
}

// ── Singleton: giữ reference đến Discord client ─────────────
let _client = null;

export function setDiscordClient(client) {
  _client = client;
}

export function getDiscordClient() {
  return _client;
}

// ── Boot: khởi tạo bot Discord (login) ─────────────────────
import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

export async function initDiscordBot() {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  });

  client.once('ready', () => {
    console.log(`🤖 Bot logged in as ${client.user.tag}`);
  });

  await client.login(process.env.DISCORD_TOKEN);
  setDiscordClient(client);
  return client;
}
