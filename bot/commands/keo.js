import axios from 'axios';
import { EmbedBuilder } from 'discord.js';

const API = process.env.BACKEND_URL || 'http://localhost:3000';

function buildEmbed(bet) {
  const stars = '⭐'.repeat(bet.confidence) + '☆'.repeat(5 - bet.confidence);
  const statusMap = { pending: '🟡 Đang chờ', win: '🟢 Win', lose: '🔴 Lose', void: '⚪ Void', half_win: '🔵 Nửa Win', half_lose: '🟠 Nửa Lose' };

  return new EmbedBuilder()
    .setColor(0x5865f2)
    .setTitle('🔥 KÈO NBA')
    .setDescription(`**${bet.match}**`)
    .addFields(
      { name: '🎯 Cược', value: bet.bet, inline: true },
      { name: '💰 Kèo', value: `${bet.odds}`, inline: true },
      { name: '📦 Stake', value: `${bet.stake}u`, inline: true },
      { name: '⭐ Tự tin', value: stars, inline: true },
      { name: '🏆 Giải', value: bet.league, inline: true },
      { name: '⏰ Giờ', value: bet.gameTime || 'TBD', inline: true },
      { name: 'Kết quả', value: statusMap[bet.status] || bet.status, inline: true }
    )
    .setFooter({ text: `ID: ${bet._id}` })
    .setTimestamp(new Date(bet.createdAt));
}

// !keo                  → xem kèo đang pending
// !keo send             → gửi tất cả kèo pending lên channel ngay lập tức
// !keo all              → xem tất cả kèo (50 gần nhất)
export const keoCommand = {
  name: 'keo',
  description: 'Xem và quản lý kèo NBA',

  async execute(message, args, { client }) {
    const sub = args[0]?.toLowerCase();

    // !keo send
    if (sub === 'send') {
      const channelId = process.env.KEO_CHANNEL_ID || message.channelId;
      const channel = await client.channels.fetch(channelId).catch(() => message.channel);

      try {
        const { data } = await axios.get(`${API}/api/bets?status=pending`);
        const bets = data.data;

        if (bets.length === 0) {
          return message.reply('✅ Không có kèo pending nào để gửi');
        }

        for (const bet of bets) {
          await channel.send({ embeds: [buildEmbed(bet)] });
          await axios.patch(`${API}/api/bets/${bet._id}/send`);
        }

        return message.reply(`📤 Đã gửi **${bets.length}** kèo lên channel thành công!`);
      } catch {
        return message.reply('❌ Không kết nối được backend. Đảm bảo backend đang chạy!');
      }
    }

    // !keo all
    const statusFilter = sub === 'all' ? '' : '?status=pending';

    try {
      const { data } = await axios.get(`${API}/api/bets${statusFilter}&limit=5`);
      const bets = data.data;

      if (bets.length === 0) {
        return message.reply(sub === 'all' ? '📭 Chưa có kèo nào trong DB' : '✅ Không có kèo pending nào');
      }

      const embeds = bets.map(buildEmbed);
      await message.reply({ content: `📋 Danh sách kèo (${bets.length} kèo):`, embeds });
    } catch {
      message.reply('❌ Không kết nối được backend!');
    }
  },
};
