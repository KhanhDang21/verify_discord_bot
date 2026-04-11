// !verify <ngay_sinh>
// Xác minh thành viên bằng ngày sinh, gán role "Verified"

export const verifyCommand = {
  name: 'verify',
  description: 'Xác minh thành viên bằng ngày sinh',

  async execute(message, args, { BIRTHDAY, ROLE_NAME }) {
    const [birthday] = args;

    const deleteAfter = async (msg, delay = 10000) => {
      setTimeout(async () => {
        await message.delete().catch(() => {});
        await msg.delete().catch(() => {});
      }, delay);
    };

    if (!birthday) {
      const reply = await message.reply('❌ Sử dụng: `!verify <ngày_sinh>` (ví dụ: `!verify 21/06/2004`)');
      deleteAfter(reply);
      return;
    }

    if (birthday !== BIRTHDAY) {
      const reply = await message.reply('❌ Sai ngày sinh rồi bạn ơi! Thử lại đi.');
      deleteAfter(reply);
      return;
    }

    const role = message.guild?.roles.cache.find((r) => r.name === ROLE_NAME);
    if (!role) {
      const reply = await message.reply(`❌ Không tìm thấy role **${ROLE_NAME}**. Báo admin kiểm tra!`);
      deleteAfter(reply);
      return;
    }

    const member = message.member;
    if (member.roles.cache.has(role.id)) {
      const reply = await message.reply('✅ Bạn đã được xác minh từ trước rồi!');
      deleteAfter(reply);
      return;
    }

    await member.roles.add(role);
    const reply = await message.reply(
      '✅ **Xác minh thành công!** Chào mừng đến vùng đất linh hồn 🎉'
    );
    console.log(`✅ [verify] ${message.author.tag} đã được cấp role ${ROLE_NAME}`);
    deleteAfter(reply, 15000);
  },
};
