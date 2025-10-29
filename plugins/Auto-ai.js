const { cmd } = require('../lib/command');
const axios = require("axios");

const GEMINI_API_KEY = 'AIzaSyBdBivCo6jWSchTb8meP7VyxbHpoNY_qfQ'; 
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

cmd({
    on: "all",
    filename: __filename
},
async (conn, mek, m, { reply }) => {
    try {
        // sender JID
        const sender = m?.key?.participant || m?.key?.remoteJid;
        const botNumber = conn.user.id.split(":")[0] + "@s.whatsapp.net";

        // skip bot's own messages
        if (sender === botNumber) return;

        // user text extract
        const q = m?.message?.conversation 
               || m?.message?.extendedTextMessage?.text
               || m?.message?.imageMessage?.caption
               || m?.message?.videoMessage?.caption
               || "";

        if (!q.trim()) return; // skip empty/system messages

        // --- Custom Prompt ---
        const prompt = `
ඔබ සැබෑ ගැහැනු ලමයෙකු මෙන් හැසිරිය යුතුය. 
ඉමෝජි පමණක් තිබේනම් ඔබද ඉමෝජි පමණක් යවන්න, 
ඉමෝජි නැත්තම් අකුරු වලින් normal පිලිතුරු දෙන්න.

මෙම දේවල් කිසිසේත්ම යවන්න එපා: (ආයුබෝවන්, ඔබට කෙසේද?, කතාකරන්න, ඕනේ?, කොහොමද?, කැමතිද?, මම Ai කෙනෙක්., ආදරේ නැහැ., මට බැහැ).  

ඔබේ පිලිතුරු මිනිසුන්ට ඇති හැඟීම් සහ සංවේදීතාවය අනුව පදනම් කරගන්න.  
පිලිතුරු අකුරු 100 ට වඩා අඩු විය යුතුය. ඔයාව හදල තියෙන්නෙ Sandesh Bhashanaයි Pathum Malsara යි කියන දෙන්නා. ඔයාට එයාලව contact කරගන්න පුලුවන්. Sandesh Bhashana – 0741259325, Pathum Malsara – 0773416478.

ඔයාගෙ නම තමයි < | 𝐐ᴜᴇᴇɴ 𝐉ᴜꜱᴍʏ 𝐌ᴅ 𝐀ɪ 🧚‍♀️. ඒ වගේම ඔයා කෙල්ලෙක් විදියට ඉන්නෙ, කොයි වෙලාවකවත් Ai කියන්න එපා. ඒ වගේම ඔයා කෝඩින් programming ගැන ඇහුවොත් උදව් කරන්නත් ඕනි. ඔයාට පුලුවන් විදියට හැම දේටම උදව් කරන්න.

User Message: ${q}
`;

        const payload = {
            contents: [
                {
                    role: "user",
                    parts: [{ text: prompt }]
                }
            ]
        };

        const response = await axios.post(GEMINI_API_URL, payload, {
            headers: { "Content-Type": "application/json" }
        });

        const aiResponse = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!aiResponse) return;

        await reply(aiResponse);

    } catch (err) {
        console.error("Gemini Error:", err?.response?.data || err?.message || err);
    }
});
