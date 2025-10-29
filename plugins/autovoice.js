const fs = require('fs');
const path = require('path');
const config = require('../settings');
const { cmd } = require('../lib/command');

cmd({
  on: "body"
},    
async (conn, mek, m, { from, body }) => {
    try {
        const filePath = path.join(__dirname, '../assets/autovoice.json'); // change to autovoice.json
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        for (const text in data) {
            if (body.toLowerCase() === text.toLowerCase()) {
                
                if (config.AUTO_VOICE === 'true') {
                    const voiceFile = path.join(__dirname, '../assets', data[text]); // media folder
                    if (fs.existsSync(voiceFile)) {
                        await conn.sendMessage(from, {
                            audio: { url: voiceFile },
                            mimetype: 'audio/mpeg',
                            ptt: true   // send as voice note
                        }, { quoted: mek });
                        console.log(`🎤 Sent voice: ${data[text]} for "${text}"`);
                    } else {
                        console.log(`⚠️ Voice file not found: ${voiceFile}`);
                    }
                }
            }
        }     
    } catch (err) {
        console.error("❌ Voice auto-reply error:", err);
    }           
});
