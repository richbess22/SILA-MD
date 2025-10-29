const { cmd } = require("../lib/command");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const apilink2 = 'https://api-pink-venom.vercel.app';

cmd({
  pattern: "logo2",
  desc: "Generate logos using ephoto templates",
  category: "convert",
  filename: __filename
}, async(conn, mek, m, { text }) => {
    if (!text) return m.reply("👉 Usage: .logo <name>");

    let name = text.trim();

    // API එකෙන් template list ගන්න
    let { data } = await axios.get(`${apilink2}/ephoto/list`);
    if (!data || !data.templates) return m.reply("❌ No templates found.");

    let templates = data.templates; // [{id,title},...]

    let sections = [
        {
            title: "🎨 Select a Logo Template",
            rows: templates.map(t => ({
                title: t.title,
                rowId: `.logomake ${t.id}|${name}`
            }))
        }
    ];

    await conn.sendMessage(m.chat, {
        text: `Select a template for *${name}* 👇`,
        buttonText: "Templates",
        sections
    }, { quoted: mek });
});

cmd({
  pattern: "logomake",
  dontAddCommandList: true,
  filename: __filename
}, async(conn, mek, m, { args }) => {
    if (!args[0]) return;
    let [id, name] = args[0].split("|");

    try {
        // Generate logo from API
        let { data } = await axios.get(`${apilink2}/ephoto/${id}?text=${encodeURIComponent(name)}`);

        if (!data || !data.image) return m.reply("❌ Failed to generate logo.");

        // Download image
        let filePath = path.join(__dirname, `${Date.now()}.jpg`);
        let response = await axios.get(data.image, { responseType: "arraybuffer" });
        fs.writeFileSync(filePath, response.data);

        // Send WhatsApp image
        await conn.sendMessage(m.chat, {
            image: fs.readFileSync(filePath),
            caption: `✅ Logo created for *${name}*`
        }, { quoted: mek });

        fs.unlinkSync(filePath);

    } catch (e) {
        console.log(e);
        return m.reply("⚠️ Error generating logo.");
    }
});
