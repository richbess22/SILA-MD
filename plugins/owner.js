const { cmd } = require("../lib/command");

cmd({
  pattern: "owner",
  react: "📇",
  desc: "Send owner contacts as vCards + detailed info message separately for each contact",
  category: "general",
  filename: __filename,
}, async (conn, mek, m) => {
  try {
    const contacts = [
      {
        name: "𝙼𝚁.𝚂𝙰𝙽𝙳𝙴𝚂𝙷 𝙱𝙷𝙰𝚂𝙷𝙰𝙽𝙰",
        number: "94741259325",
        info: `
*𝐎ᴡɴᴇʀ 𝐈ɴꜰᴏʀᴍᴀᴛɪᴏɴ*

👤 *Name:* _Sandesh Bhashana_
📱 *Number:* _+94 74 125 9325_
🌐 *Website:* _https://king-sandesh-md-ofc-web.pages.dev/_
💼 *Role:* _Developer & Owner Of QJ_
✉️ *Email:* _mrsandeshbhashana@gmail.com_
📍 *Location:* _Sri Lanka,Matara_

> *< | 𝐐ᴜᴇᴇɴ 𝐉ᴜꜱᴍʏ 𝐌ᴅ 🧚‍♀️*
`
      },
      {
        name: "𝙼𝚁.𝙿𝙰𝚃𝙷𝚄𝙼 𝙼𝙰𝙻𝚂𝙰𝚁𝙰",
        number: "94723975388",
        info: `
*𝐎ᴡɴᴇʀ 𝐈ɴꜰᴏʀᴍᴀᴛɪᴏɴ*

👤 *Name:* _Pathum Malsara_
📱 *Number:* _+94 72 397 5388_
💼 *Role:* _Developer & Owner Of QJ_
📍 *Location:* _Sri Lanka_

> *< | 𝐐ᴜᴇᴇɴ 𝐉ᴜꜱᴍʏ 𝐌ᴅ 🧚‍♀️*
`
      }
    ];

    for (let contact of contacts) {
      // Send vCard
      const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${contact.name}
ORG:QUEEN JUSMY MD;
TEL;type=CELL;type=VOICE;waid=${contact.number}:${contact.number}
END:VCARD`;

      await conn.sendMessage(
        m.chat,
        {
          contacts: {
            displayName: contact.name,
            contacts: [{ vcard }],
          },
        },
        { quoted: mek }
      );

      await new Promise(resolve => setTimeout(resolve, 500)); // avoid rate limits

      // Send detailed info as separate reply
      await conn.sendMessage(m.chat, { text: contact.info }, { quoted: mek });

      await new Promise(resolve => setTimeout(resolve, 500));
    }

  } catch (err) {
    console.log(err);
    m.reply("❌ Error sending owner information!");
  }
});
