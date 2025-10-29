const axios = require("axios");
const config = require('../settings');
const fs = require("fs");
const { cmd } = require("../lib/command");

cmd({
  pattern: "gethtml",
  alias: ["htmlsource", "source"],
  react: "🌐",
  desc: "Get HTML source code of a website. Short code = message, long code = file.",
  category: "other",
  use: ".gethtml <url>",
  filename: __filename,
}, 
async (conn, mek, m, { reply, q }) => {
  if (!q) {
    return reply("Please provide a URL.\nExample: .gethtml https://example.com");
  }

  try {
    let url = q.trim();
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "http://" + url;
    }

    const response = await axios.get(url);
    const html = response.data;

    if (html.length <= 3500) {
      // Short content: send as message
      await reply(`*🌐 𝙷𝚃𝙼𝙻 𝚂𝙾𝚄𝚁𝙲𝙴 𝙾𝙵:* ${url}\n\n${html}\n\n${config.FOOTER}`);
    } else {
      // Long content: send as file
      const filename = `html_source_${Date.now()}.txt`;
      fs.writeFileSync(filename, html);
      await conn.sendMessage(m.chat, { document: fs.readFileSync(filename), fileName: filename, mimetype: "text/plain" }, { quoted: m });
      fs.unlinkSync(filename);
    }

  } catch (e) {
    console.log(e);
    await reply("❌ Failed to fetch the URL or invalid URL provided.");
  }
});
