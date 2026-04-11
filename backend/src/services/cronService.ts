import cron from 'node-cron';
import { sendPendingBets, getDiscordClient } from './discordNotifier.js';

const MORNING = process.env.CRON_MORNING || '0 8 * * *';
const EVENING = process.env.CRON_EVENING || '0 18 * * *';

function runSendPendingBets(): void {
  const client = getDiscordClient();
  if (!client) {
    console.warn('⚠️  Discord client chưa sẵn sàng');
    return;
  }
  sendPendingBets(client).catch(console.error);
}

export function initCronJobs(): void {
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
