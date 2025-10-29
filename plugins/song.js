const config = require('../settings');
const { cmd } = require('../lib/command');
const DY_SCRAP = require('@dark-yasiya/scrap');
const dy_scrap = new DY_SCRAP();

function replaceYouTubeID(url) {
    const regex = /(?:youtube\.com\/(?:.*v=|.*\/)|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

cmd({
    pattern: "play3",
    alias: ["mp3", "ytmp3", "song"],
    react: "🎵",
    desc: "Download Ytmp3",
    category: "download",
    use: ".song <Text or YT URL>",
    filename: __filename
}, async (conn, m, mek, { from, q, reply }) => {
    try {
        if (!q) return await reply("*❌ ᴘʟᴇᴀꜱᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ Qᴜᴇʀʏ ᴏʀ ʏᴏᴜ ᴛᴜʙᴇ ᴜʀʟ...!*");

        let id = q.startsWith("https://") ? replaceYouTubeID(q) : null;

        if (!id) {
            const searchResults = await dy_scrap.ytsearch(q);
            if (!searchResults?.results?.length) return await reply("*❌ ɴᴏ ʀᴇꜱᴜʟᴛꜱ ꜰᴏᴜɴᴅ...!*");
            id = searchResults.results[0].videoId;
        }

        const data = await dy_scrap.ytsearch(`https://youtube.com/watch?v=${id}`);
        if (!data?.results?.length) return await reply("*❌ ꜰᴀɪʟᴅ ᴛᴏ ꜰᴇᴛᴄʜ ᴠɪᴅᴇᴏ...!*");

        const { url, title, image, timestamp, ago, views, author } = data.results[0];

        let info = ` *< | 𝐐ᴜᴇᴇɴ 𝐉ᴜꜱᴍʏ 𝐌ᴅ 🧚‍♀️ 𝐒ᴏɴɢ 𝐃ᴏᴡɴʟᴏᴀᴅᴇʀ* \n\n` +
            `🎵 *𝚃𝙸𝚃𝙻𝙴:* ${title || "Unknown"}\n\n` +
            `⏳ *𝙳𝚄𝚁𝙰𝚃𝙸𝙾𝙽:* ${timestamp || "Unknown"}\n\n` +
            `👀 *𝚅𝙸𝙴𝚆𝚂:* ${views || "Unknown"}\n\n` +
            `🌏 *𝚁𝙴𝙻𝙴𝙰𝚂𝙴𝙳 𝙰𝙶𝙾:* ${ago || "Unknown"}\n\n` +
            `👤 *𝙰𝚄𝚃𝙷𝙾𝚁:* ${author?.name || "Unknown"}\n\n` +
            `🖇 *𝚄𝚁𝙻:* ${url || "Unknown"}\n\n\n` +
            `🔽 *𝐑𝐞𝐩𝐥𝐲 𝐖𝐢𝐭𝐡 𝐘𝐨𝐮𝐫 𝐂𝐡𝐨𝐢𝐜𝐞 𝐎𝐫 𝐂𝐥𝐢𝐜𝐤 𝐁𝐮𝐭𝐭𝐨𝐧*\n\n` +
            `❶. *𝙰𝚄𝙳𝙸𝙾 𝚃𝚈𝙿𝙴* 🎵\n` +
            `➋. *𝙳𝙾𝙲𝚄𝙼𝙴𝙽𝚃 𝚃𝚈𝙿𝙴* 📁\n\n` +
            `${config.FOOTER}`;

        const sentMsg = await conn.sendMessage(from, { 
            image: { url: image }, 
            caption: info,
            buttons: [
                { buttonId: `song_audio_${id}`, buttonText: { displayText: "🎵 𝙰𝚄𝙳𝙸𝙾 𝚃𝚈𝙿𝙴" }, type: 1 },
                { buttonId: `song_doc_${id}`, buttonText: { displayText: "📁 𝙳𝙾𝙲𝚄𝙼𝙴𝙽𝚃 𝚃𝚈𝙿𝙴" }, type: 1 }
            ],
            headerType: 4
        }, { quoted: mek });

        const messageID = sentMsg.key.id;
        await conn.sendMessage(from, { react: { text: '🎶', key: sentMsg.key } });

        // Handle reply method (1 / 2)
        conn.ev.on('messages.upsert', async (messageUpdate) => { 
            try {
                const mekInfo = messageUpdate?.messages[0];
                if (!mekInfo?.message) return;

                const messageType = mekInfo?.message?.conversation || mekInfo?.message?.extendedTextMessage?.text;
                const isReplyToSentMsg = mekInfo?.message?.extendedTextMessage?.contextInfo?.stanzaId === messageID;

                if (!isReplyToSentMsg) return;

                let userReply = messageType.trim();
                let response, type;
                
                if (userReply === "1") {
                    response = await dy_scrap.ytmp3(`https://youtube.com/watch?v=${id}`);
                    let downloadUrl = response?.result?.download?.url;
                    if (!downloadUrl) return await reply("❌ ᴅᴏᴡɴʟᴏᴀᴅ ʟɪɴᴋ ɴᴏᴛ ꜰᴏᴜɴᴅ!");
                    type = { audio: { url: downloadUrl }, mimetype: "audio/mpeg" };

                } else if (userReply === "2") {
                    response = await dy_scrap.ytmp3(`https://youtube.com/watch?v=${id}`);
                    let downloadUrl = response?.result?.download?.url;
                    if (!downloadUrl) return await reply("❌ ᴅᴏᴡɴʟᴏᴀᴅ ʟɪɴᴋ ɴᴏᴛ ꜰᴏᴜɴᴅ!");
                    type = { document: { url: downloadUrl }, fileName: `${title}.mp3`, mimetype: "audio/mpeg", caption: title };

                } else { 
                    return await reply("*❌ ɪɴᴠᴀʟɪᴅ ᴄʜᴏɪᴄᴇ...! ᴘʟᴇᴀꜱᴇ ʀᴇᴘʟʏ ❶ ᴏʀ ❷*");
                }

                await conn.sendMessage(from, type, { quoted: mek });
            } catch (error) {
                console.error(error);
                await reply(`❌ *ᴀɴ ᴇʀʀᴏʀ:* ${error.message || "ᴜɴᴋɴᴏᴡɴ ᴇʀʀᴏʀ"}`);
            }
        });

        // Handle button clicks
        conn.ev.on('messages.upsert', async (buttonUpdate) => {
            try {
                const btn = buttonUpdate?.messages[0];
                const btnId = btn?.message?.buttonsResponseMessage?.selectedButtonId;
                if (!btnId) return;

                let response, type;

                if (btnId === `song_audio_${id}`) {
                    response = await dy_scrap.ytmp3(`https://youtube.com/watch?v=${id}`);
                    let downloadUrl = response?.result?.download?.url;
                    if (!downloadUrl) return await reply("❌ ᴅᴏᴡɴʟᴏᴀᴅ ʟɪɴᴋ ɴᴏᴛ ꜰᴏᴜɴᴅ!");
                    type = { audio: { url: downloadUrl }, mimetype: "audio/mpeg" };

                } else if (btnId === `song_doc_${id}`) {
                    response = await dy_scrap.ytmp3(`https://youtube.com/watch?v=${id}`);
                    let downloadUrl = response?.result?.download?.url;
                    if (!downloadUrl) return await reply("❌ ᴅᴏᴡɴʟᴏᴀᴅ ʟɪɴᴋ ɴᴏᴛ ꜰᴏᴜɴᴅ!");
                    type = { document: { url: downloadUrl }, fileName: `${title}.mp3`, mimetype: "audio/mpeg", caption: title };
                }

                if (type) await conn.sendMessage(from, type, { quoted: mek });

            } catch (err) {
                console.error(err);
            }
        });

    } catch (error) {
        console.error(error);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        await reply(`❌ *ᴀɴ ᴇʀʀᴏʀ:* ${error.message || "ᴜɴᴋɴᴏᴡɴ ᴇʀʀᴏʀ"}`);
    }
});
