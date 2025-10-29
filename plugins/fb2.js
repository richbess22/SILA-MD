const axios = require("axios");
const cheerio = require('cheerio');
const { cmd, commands } = require('../lib/command')
const config = require('../settings');
const {fetchJson} = require('../lib/functions');

const api = `https://nethu-api-ashy.vercel.app`;

cmd({
  pattern: "facebook2",
  react: "🎥",
  alias: ["fbb2", "fbvideo2", "fb2"],
  desc: "Download videos from Facebook",
  category: "download",
  use: '.facebook <facebook_url>',
  filename: __filename
},
async(conn, mek, m, {
    from, prefix, q, reply
}) => {
  try {
  if (!q) return reply("🚩 Please give me a facebook url");

  const fb = await fetchJson(`${api}/download/fbdown?url=${encodeURIComponent(q)}`);
  
  if (!fb.result || (!fb.result.sd && !fb.result.hd)) {
    return reply("I couldn't find anything :(");
  }

  let caption = `*🖥️ 𝐊ꜱᴍ𝐃 𝐅ᴀᴄᴇʙᴏᴏ𝐊 𝐃𝐋*

📝 ＴＩＴＬＥ : 𝙵𝙰𝙲𝙴𝙱𝙾𝙾𝙺 𝚅𝙸𝙳𝙴𝙾
🔗 ＵＲＬ : ${q}`;


  if (fb.result.thumb) {
    await conn.sendMessage(from, {
      image: { url: fb.result.thumb },
      caption : caption,
      }, mek);
  }

    if (fb.result.sd) {
      await conn.sendMessage(from, {
        video: { url: fb.result.sd },
        mimetype: "video/mp4",
        caption: `*𝚂𝙳-𝚀𝚄𝙰𝙻𝙸𝚃𝚈*`
      }, { quoted: mek });
    }

if (fb.result.hd) {
      await conn.sendMessage(from, {
        video: { url: fb.result.hd },
        mimetype: "video/mp4",
        caption: `*𝙷𝙳-𝚀𝚄𝙰𝙻𝙸𝚃𝚈*`
      }, { quoted: mek });
    }

} catch (err) {
  console.error(err);
  reply("*ERROR*");
  }
});
