const { cmd } = require('../lib/command');
const axios = require('axios');

cmd({
    pattern: "tiktok",
    alias: ["ttdl", "tt", "tiktokdl"],
    desc: "Download TikTok video without watermark",
    category: "downloader",
    react: "🎵",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply }) => {
    try {
        if (!q) return reply("Please provide a TikTok video link.");
        if (!q.includes("tiktok.com")) return reply("Invalid TikTok link.");
        
        reply("⏳ 𝐃ᴏᴡɴʟᴏᴀᴅɪɴɢ 𝐘ᴏᴜʀ 𝐕ɪᴅᴇᴏ, 𝐏ʟᴇᴀꜱᴇ 𝐖ᴀɪᴛ 𝐒ɪʀ...");
        
        const apiUrl = `https://delirius-apiofc.vercel.app/download/tiktok?url=${q}`;
        const { data } = await axios.get(apiUrl);
        
        if (!data.status || !data.data) return reply("Failed to fetch TikTok video.");
        
        const { title, like, comment, share, author, meta } = data.data;
        const videoUrl = meta.media.find(v => v.type === "video").org;
        
        const caption = `🎵 *< | 𝐐ᴜᴇᴇɴ 𝐉ᴜꜱᴍʏ 𝐌ᴅ 𝐓ɪᴋ 𝐓ᴏᴋ 𝐃ʟ* 🎵\n\n` +
                        `👤 *𝚄𝚂𝙴𝚁:* ${author.nickname} (@${author.username})\n` +
                        `📖 *𝚃𝙸𝚃𝙻𝙴:* ${title}\n` +
                        `👍 *𝙻𝙸𝙺𝙴𝚂:* ${like}\n💬 *𝙲𝙾𝙼𝙼𝙴𝙽𝚃𝚂:* ${comment}\n🔁 *𝚂𝙷𝙰𝚁𝙴𝚂:* ${share}`;
        
        await conn.sendMessage(from, {
            video: { url: videoUrl },
            caption: caption,
            contextInfo: { mentionedJid: [m.sender] }
        }, { quoted: mek });
        
    } catch (e) {
        console.error("Error in TikTok downloader command:", e);
        reply(`An error occurred: ${e.message}`);
    }
});
          
