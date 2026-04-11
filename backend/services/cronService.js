import cron from 'node-cron';
import { sendPendingBets, getDiscordClient } from './discordNotifier.js';

// Cron mặc định: 8h sáng và 6h tối mỗi ngày (timezone Asia/Ho_Chi_Minh)
const MORNING = process.env.CRON_MORNING || '0 8 * * *';
const EVENING = process.env.CRON_EVENING || '0 18 * * *';

function runSendPendingBets() {
  const client = getDiscordClient();
  if (!client) {
    console.warn('⚠️  Discord client chưa sẵn sàng');
    return;
  }
  sendPendingBets(client).catch(console.error);
}

export function initCronJobs() {
  cron.schedule(MORNING, () => {
    console.log('⏰ [CRON] Auto gửi kèo buổi sáng...');
    runSendPendingBets();
  }, { timezone: 'Asia/Ho_Chi_Minh' });

  cron.schedule(EVENING, () => {
    console.log('⏰ [CRON] Auto gửi kèo buổi tối...');
    runSendPendingBets();
  }, { timezone: 'Asia/Ho_Chi_Minh' });

  console.log(`📅 Cron jobs đã khởi động: ${MORNING} & ${EVENING} (Asia/Ho_Chi_Minh)`);
}
