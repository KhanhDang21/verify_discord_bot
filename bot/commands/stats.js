import axios from 'axios';
import { EmbedBuilder } from 'discord.js';

const API = process.env.BACKEND_URL || 'http://localhost:3000';

// !stats  → thống kê tổng quan winrate, ROI, profit
export const statsCommand = {
  name: 'stats',
  description: 'Xem thống kê winrate & ROI',

  async execute(message) {
    try {
      const { data } = await axios.get(`${API}/api/bets/stats`);
      const s = data.data;

      const embed = new EmbedBuilder()
        .setColor(0x57f287) // green
        .setTitle('📊 THỐNG KÊ KÈO NBA')
        .addFields(
          { name: '🎯 Winrate', value: s.winrate, inline: true },
          { name: '📈 ROI', value: s.roi, inline: true },
          { name: '💵 Tổng Profit', value: `${s.totalProfit}u`, inline: true },
          { name: '✅ Thắng', value: `${s.wins}`, inline: true },
          { name: '❌ Thua', value: `${s.loses}`, inline: true },
          { name: '⚪ Void', value: `${s.voids}`, inline: true },
          { name: '🟡 Đang chờ', value: `${s.pending}`, inline: true },
          { name: '📋 Tổng kèo (đã giải)', value: `${s.total}`, inline: true }
        )
        .setTimestamp();

      return message.reply({ embeds: [embed] });
    } catch {
      message.reply('❌ Không lấy được stats. Backend đang chạy không?');
    }
  },
};
