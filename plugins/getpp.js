const { cmd } = require("../lib/command");
const config = require('../settings');

cmd({
  pattern: "getpp",
  desc: "Download the profile picture of the user you're chatting with",
  category: "tools",
  react: "🖼️",
  filename: __filename
}, async (conn, msg, m, { reply, from }) => {
  try {
    const target = msg.key.remoteJid; // <-- get the inbox owner (group/member/inbox)

    // If it's a group, do nothing or skip
    if (target.endsWith("@g.us")) {
      return reply("*❌ This command only works in personal chats.*");
    }

    let profilePicUrl;
    try {
      profilePicUrl = await conn.profilePictureUrl(target, "image");
    } catch (e) {
      profilePicUrl = "https://i.ibb.co/tmD1Hqr/no-profile-picture.png"; // fallback
    }

    const caption = `🖼️ *𝙿𝚁𝙾𝙵𝙸𝙻𝙴 𝙿𝙸𝙲 𝙾𝙵 𝙲𝙷𝙰𝚃 𝙾𝚆𝙽𝙴𝚁..!*\n\n${config.FOOTER}`;

    await conn.sendMessage(from, {
      image: { url: profilePicUrl },
      caption
    }, { quoted: msg });

    await conn.sendMessage(from, {
      react: { text: "✅", key: msg.key }
    });

  } catch (e) {
    console.log(e);
    reply("❌ Couldn't fetch the profile picture.");
  }
});
