const config = require('../settings');
const { cmd } = require('../lib/command');
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson, jsonformat} = require('../lib/functions');
const DY_SCRAP = require('@dark-yasiya/scrap');
const dy_scrap = new DY_SCRAP();

function replaceYouTubeID(url) {
  const regex = /(?:youtube\.com\/(?:.*v=|.*\/)|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

cmd({
  pattern: "song8",
  alias: ["play6", "mp8", "ytmp8"],
  react: "🎵",
  desc: "Download Ytmp3 (Single Button)",
  category: "download",
  use: ".song <Text or YT URL>",
  filename: __filename
}, async (conn, m, mek, { from, q, reply }) => {
  try {
    if (!q) return await reply("❌ Please provide a Query or Youtube URL!");

    let id = q.startsWith("https://") ? replaceYouTubeID(q) : null;

    if (!id) {
      const searchResults = await dy_scrap.ytsearch(q);
      if (!searchResults?.results?.length) return await reply("❌ No results found!");
      id = searchResults.results[0].videoId;
    }

    const data = await dy_scrap.ytsearch(`https://youtube.com/watch?v=${id}`);
    if (!data?.results?.length) return await reply("❌ Failed to fetch video!");

    const { url, title, image, timestamp, ago, views, author } = data.results[0];

    let info = `*🎵 NOVA-X SONG DOWNLOADER 🎵*\n\n` +
      `🎵 *TITLE:* ${title}\n` +
      `⏳ *DURATION:* ${timestamp}\n` +
      `👀 *VIEWS:* ${views}\n` +
      `🌏 *RELEASED AGO:* ${ago}\n` +
      `👤 *AUTHOR:* ${author?.name}\n` +
      `🖇 *URL:* ${url}\n\n` +
      `⬇️ *Select your download format below*`;

    // single select button only
    const buttons = [
      {
        name: "single_select",
        buttonParamsJson: JSON.stringify({
          title: "Download Options",
          sections: [
            {
              title: "Choose Format",
              rows: [
                {
                  header: "Audio",
                  title: "🎧 Download MP3",
                  description: "High quality audio",
                  id: `.fbdl audio ${id}`
                },
                {
                  header: "Document",
                  title: "📂 Download as File",
                  description: "MP3 as document",
                  id: `.fbdl document ${id}`
                }
              ]
            }
          ]
        })
      }
    ];

    await conn.sendMessage(from, {
      image: { url: image },
      caption: info,
      footer: "ᴘᴏᴡᴇʀᴇᴅ ʙʏ NOVA-X-MD",
      buttons
    }, { quoted: mek });

  } catch (error) {
    console.error(error);
    await reply(`❌ Error: ${error.message}`);
  }
});

// Handler for download
cmd({
  pattern: "fbdl",
  dontAddCommandList: true,
  filename: __filename
}, async (conn, m, mek, { from, args, reply }) => {
  try {
    let type = args[0];
    let id = args[1];
    if (!id) return await reply("❌ Invalid request!");

    const response = await dy_scrap.ytmp3(`https://youtube.com/watch?v=${id}`);
    let downloadUrl = response?.result?.download?.url;
    if (!downloadUrl) return await reply("❌ Download link not found!");

    if (type === "audio") {
      await conn.sendMessage(from, { audio: { url: downloadUrl }, mimetype: "audio/mpeg" }, { quoted: mek });
    } else if (type === "document") {
      await conn.sendMessage(from, {
        document: { url: downloadUrl },
        fileName: `${Date.now()}.mp3`,
        mimetype: "audio/mpeg",
        caption: "Your Song 🎵"
      }, { quoted: mek });
    } else {
      await reply("❌ Invalid download type!");
    }

  } catch (err) {
    console.error(err);
    await reply(`❌ Error: ${err.message}`);
  }
});
