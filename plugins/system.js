const os = require("os");
const { cmd } = require('../lib/command');

cmd({
  pattern: "system",
  desc: "Show bot system info",
  filename: __filename
}, async (conn, mek, m) => {
  try {
    // React first
    await conn.sendMessage(m.chat, { react: { text: "🖥️", key: m.key } });

    // RAM Usage
    let totalMem = (os.totalmem() / 1024 / 1024).toFixed(2); // MB
    let freeMem = (os.freemem() / 1024 / 1024).toFixed(2); // MB
    let usedMem = (totalMem - freeMem).toFixed(2);

    // Uptime
    let uptimeSec = os.uptime();
    let hours = Math.floor(uptimeSec / 3600);
    let minutes = Math.floor((uptimeSec % 3600) / 60);
    let seconds = Math.floor(uptimeSec % 60);

    // Platform & Owner
    let platform = os.platform();
    let arch = os.arch();

    let msg = `
 *👾 𝐍ᴏᴠᴀ-𝐗 𝐒ʏꜱᴛᴇ𝐌 𝐈ɴꜰ𝐎 👾*
  ┌─────────────✦✦✦✦
  │✑ 📈 *𝚁𝙰𝙼 𝚄𝚂𝙰𝙶𝙴* : ${usedMem} ＭＢ / ${totalMem} ＭＢ
  │
  │✑ ⏱️ *𝚄𝙿𝚃𝙸𝙼𝙴* : ${hours}ｈ ${minutes}ｍ ${seconds}ｓ
  │
  │✑ 🖥️ *𝙿𝙻𝙰𝚃𝙵𝙾𝚁𝙼* : ${platform} (${arch})
  │
  │✑ 👤 *𝙾𝚆𝙽𝙴𝚁* : Ｐᴀᴛʜᴜᴍ Ｍᴀʟꜱᴀʀᴀ & Ｓᴀɴᴅᴇꜱʜ Ｂʜᴀꜱʜᴀɴᴀ
  └──────────────✦✦✦✦`;

    // Send system info
    await conn.sendMessage(m.chat, { text: msg }, { quoted: mek });

  } catch (err) {
    console.log("System Command Error:", err);
  }
});
