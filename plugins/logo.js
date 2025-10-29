const { cmd, commands } = require("../lib/command");
const { fetchJson } = require("../lib/functions");

cmd({
    pattern: "logo",
    desc: "Create logos",
    category: "convert",
    filename: __filename
},
async(conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if(!q) return reply("*_Please give me a text._*")

        // Extend message list
let logoMsg = `*NOVA-X LOGO CREATION📨*

*Text :* ${q}

*🔢 Reply Below Number :*
╭━━━━━━━━━━━━━━━➤
┃ *1.❯* Black Pink
┃ *2.❯* Black Pink 2
┃ *3.❯* Black Pink 3
┃ *4.❯* Naruto
┃ *5.❯* Digital Glitch
┃ *6.❯* Pixel Glitch
┃ *7.❯* Comic Style
┃ *8.❯* Neon Light
┃ *9.❯* Free Bear
┃ *10.❯* Devil Wings
┃ *11.❯* Futuristic Technology
┃ *12.❯* Silver 3D
┃ *13.❯* 3D Paper Cut
┃ *14.❯* Pubg 1
┃ *15.❯* Pubg 2
┃ *16.❯* Free Fire Cover
┃ *17.❯* Text On Wet Glass
┃ *18.❯* Typography
┃ *19.❯* Modern Gold
┃ *20.❯* Matrix
┃ *21.❯* Glitch (Logo1)
┃ *22.❯* Neon (Logo1)
┃ *23.❯* Magma (Logo1)
┃ *24.❯* Ice Cold (Logo1)
┃ *25.❯* Thunder (Logo1)
╰━━━━━━━━━━━━━━━➤

> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɴᴏᴠᴀ-x-ᴍᴅ`

        const fdChannel = {
            newsletterJid: "120363409414874042@newsletter",
            newsletterName: "𝐍ｏ𝐕𝐀-ｘ Ｍ𝐃",
            serverMessageId: 999
        };
        const contextMsg = {
            mentionedJid: [m.sender],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: fdChannel
        };
        const msgBody = {
            image: {url:`https://files.catbox.moe/rxaw7o.jpeg`},
            caption: logoMsg,
            contextInfo: contextMsg
        };
        let send = await conn.sendMessage(from, msgBody, {
            'quoted': mek
        })

        conn.ev.on('messages.upsert', async (msgUpdate) => {
            const msg = msgUpdate.messages[0];
            if (!msg.message || !msg.message.extendedTextMessage) return;

            const selectedOption = msg.message.extendedTextMessage.text.trim();

            if (msg.message.extendedTextMessage.contextInfo && msg.message.extendedTextMessage.contextInfo.stanzaId === send.key.id) {
                switch (selectedOption) {
                    case '1':
                        let data1 = await fetchJson(`${apilink2}/api/logo?url=${logo1}&name=${q}`)
                        await conn.sendMessage(from, { image :{url : `${data1.result.download_url}`}, caption : `${caption}`},{quoted : mek})
                        break;
                    case '2':
                        let data2 = await fetchJson(`${apilink2}/api/logo?url=${logo2}&name=${q}`)
                        await conn.sendMessage(from, { image :{url : `${data2.result.download_url}`}, caption : `${caption}`},{quoted : mek})
                        break;
                    case '3':
                        let data3 = await fetchJson(`${apilink2}/api/logo?url=${logo3}&name=${q}`)
                        await conn.sendMessage(from, { image :{url : `${data3.result.download_url}`}, caption : `${caption}`},{quoted : mek})
                        break;
                    case '4':
                        let data4 = await fetchJson(`${apilink2}/api/logo?url=${logo4}&name=${q}`)
                        await conn.sendMessage(from, { image :{url : `${data4.result.download_url}`}, caption : `${caption}`},{quoted : mek})
                        break;
                    case '5':
                        let data5 = await fetchJson(`${apilink2}/api/logo?url=${logo5}&name=${q}`)
                        await conn.sendMessage(from, { image :{url : `${data5.result.download_url}`}, caption : `${caption}`},{quoted : mek})
                        break;
                    case '6':
                        let data6 = await fetchJson(`${apilink2}/api/logo?url=${logo6}&name=${q}`)
                        await conn.sendMessage(from, { image :{url : `${data6.result.download_url}`}, caption : `${caption}`},{quoted : mek})
                        break;
                    case '7':
                        let data7 = await fetchJson(`${apilink2}/api/logo?url=${logo7}&name=${q}`)
                        await conn.sendMessage(from, { image :{url : `${data7.result.download_url}`}, caption : `${caption}`},{quoted : mek})
                        break;
                    case '8':
                        let data8 = await fetchJson(`${apilink2}/api/logo?url=${logo8}&name=${q}`)
                        await conn.sendMessage(from, { image :{url : `${data8.result.download_url}`}, caption : `${caption}`},{quoted : mek})
                        break;
                    case '9':
                        let data9 = await fetchJson(`${apilink2}/api/logo?url=${logo9}&name=${q}`)
                        await conn.sendMessage(from, { image :{url : `${data9.result.download_url}`}, caption : `${caption}`},{quoted : mek})
                        break;
                    case '10':
                        let data10 = await fetchJson(`${apilink2}/api/logo?url=${logo10}&name=${q}`)
                        await conn.sendMessage(from, { image :{url : `${data10.result.download_url}`}, caption : `${caption}`},{quoted : mek})
                        break;
                    case '11':
                        let data11 = await fetchJson(`${apilink2}/api/logo?url=${logo11}&name=${q}`)
                        await conn.sendMessage(from, { image :{url : `${data11.result.download_url}`}, caption : `${caption}`},{quoted : mek})
                        break;
                    case '12':
                        let data12 = await fetchJson(`${apilink2}/api/logo?url=${logo12}&name=${q}`)
                        await conn.sendMessage(from, { image :{url : `${data12.result.download_url}`}, caption : `${caption}`},{quoted : mek})
                        break;
                    case '13':
                        let data13 = await fetchJson(`${apilink2}/api/logo?url=${logo13}&name=${q}`)
                        await conn.sendMessage(from, { image :{url : `${data13.result.download_url}`}, caption : `${caption}`},{quoted : mek})
                        break;
                    case '14':
                        let data14 = await fetchJson(`${apilink2}/api/logo?url=${logo14}&name=${q}`)
                        await conn.sendMessage(from, { image :{url : `${data14.result.download_url}`}, caption : `${caption}`},{quoted : mek})
                        break;
                    case '15':
                        let data15 = await fetchJson(`${apilink2}/api/logo?url=${logo15}&name=${q}`)
                        await conn.sendMessage(from, { image :{url : `${data15.result.download_url}`}, caption : `${caption}`},{quoted : mek})
                        break;
                    case '16':
                        let data16 = await fetchJson(`${apilink2}/api/logo?url=${logo16}&name=${q}`)
                        await conn.sendMessage(from, { image :{url : `${data16.result.download_url}`}, caption : `${caption}`},{quoted : mek})
                        break;
                    case '17':
                        let data17 = await fetchJson(`${apilink2}/api/logo?url=${logo17}&name=${q}`)
                        await conn.sendMessage(from, { image :{url : `${data17.result.download_url}`}, caption : `${caption}`},{quoted : mek})
                        break;
                    case '18':
                        let data18 = await fetchJson(`${apilink2}/api/logo?url=${logo18}&name=${q}`)
                        await conn.sendMessage(from, { image :{url : `${data18.result.download_url}`}, caption : `${caption}`},{quoted : mek})
                        break;
                    case '19':
                        let data19 = await fetchJson(`${apilink2}/api/logo?url=${logo19}&name=${q}`)
                        await conn.sendMessage(from, { image :{url : `${data19.result.download_url}`}, caption : `${caption}`},{quoted : mek})
                        break;
                    case '20':
                        let data20 = await fetchJson(`${apilink2}/api/logo?url=${logo20}&name=${q}`)
                        await conn.sendMessage(from, { image :{url : `${data20.result.download_url}`}, caption : `${caption}`},{quoted : mek})
                        break;
                    case '21':
    let d21 = await fetchJson(`${apilink2}/api/logo?url=${logo21}&name=${q}`)
    await conn.sendMessage(from, { image: { url: d21.result.download_url }, caption }, { quoted: mek })
    break;
case '22':
    let d22 = await fetchJson(`${apilink2}/api/logo?url=${logo22}&name=${q}`)
    await conn.sendMessage(from, { image: { url: d22.result.download_url }, caption }, { quoted: mek })
    break;
case '23':
    let d23 = await fetchJson(`${apilink2}/api/logo?url=${logo23}&name=${q}`)
    await conn.sendMessage(from, { image: { url: d23.result.download_url }, caption }, { quoted: mek })
    break;
case '24':
    let d24 = await fetchJson(`${apilink2}/api/logo?url=${logo24}&name=${q}`)
    await conn.sendMessage(from, { image: { url: d24.result.download_url }, caption }, { quoted: mek })
    break;
case '25':
    let d25 = await fetchJson(`${apilink2}/api/logo?url=${logo25}&name=${q}`)
    await conn.sendMessage(from, { image: { url: d25.result.download_url }, caption }, { quoted: mek })
    break;
                  default:
                        reply("*_Invalid number.Please reply a valid number._*");
                }
            }
        })

    }catch(e){
        console.log(e)
        reply(`${e}`)
    }
});

// Constants for logo URLs
const logo1 = 'https://en.ephoto360.com/create-a-blackpink-style-logo-with-members-signatures-810.html';
const logo2 = `https://en.ephoto360.com/online-blackpink-style-logo-maker-effect-711.html`;
const logo3 = `https://en.ephoto360.com/create-a-blackpink-neon-logo-text-effect-online-710.html`;
const logo4 = `https://en.ephoto360.com/naruto-shippuden-logo-style-text-effect-online-808.html`;
const logo5 = `https://en.ephoto360.com/create-digital-glitch-text-effects-online-767.html`;
const logo6 = `https://en.ephoto360.com/create-pixel-glitch-text-effect-online-769.html`;
const logo7 = `https://en.ephoto360.com/create-online-3d-comic-style-text-effects-817.html`;
const logo8 = `https://en.ephoto360.com/create-colorful-neon-light-text-effects-online-797.html`;
const logo9 = `https://en.ephoto360.com/free-bear-logo-maker-online-673.html`;
const logo10 = `https://en.ephoto360.com/neon-devil-wings-text-effect-online-683.html`;
const logo11 = `https://en.ephoto360.com/light-text-effect-futuristic-technology-style-648.html`;
const logo12 = `https://en.ephoto360.com/create-glossy-silver-3d-text-effect-online-802.html`;
const logo13 = `https://en.ephoto360.com/multicolor-3d-paper-cut-style-text-effect-658.html`;
const logo14 = `https://en.ephoto360.com/free-pubg-logo-maker-online-609.html`;
const logo15 = `https://en.ephoto360.com/pubg-logo-maker-cute-character-online-617.html`;
const logo16 = `https://en.ephoto360.com/create-free-fire-facebook-cover-online-567.html`;
const logo17 = `https://en.ephoto360.com/write-text-on-wet-glass-online-589.html`;
const logo18 = `https://en.ephoto360.com/create-online-typography-art-effects-with-multiple-layers-811.html`;
const logo19 = `https://en.ephoto360.com/modern-gold-5-215.html`;
const logo20 = `https://en.ephoto360.com/matrix-text-effect-154.html`;
const logo21 = `https://en.ephoto360.com/create-a-glitch-text-effect-online-free-712.html`;
const logo22 = `https://en.ephoto360.com/create-glowing-neon-text-effect-online-free-879.html`;
const logo23 = `https://en.ephoto360.com/create-magma-hot-text-effect-online-642.html`;
const logo24 = `https://en.ephoto360.com/ice-cold-text-effect-155.html`;
const logo25 = `https://en.ephoto360.com/create-thunder-text-effect-online-free-631.html`;


const apilink2 = 'https://api-pink-venom.vercel.app';
const caption = `> ɢᴇɴᴀʀᴀᴛᴇᴅ ʙʏ ɴᴏᴠᴀ-x- ᴍᴅ`;






//   ================== group category plugin====================



// Helper function to check permissions
const checkPermissions = (isGroup, isAdmins, isOwner, isBotAdmins) => {
    if (!isGroup) return 'This command can only be used in groups.';
    if (!isAdmins && !isOwner) return 'This command can only be used by group admins.';
    if (!isBotAdmins) return 'Bot must be admin to use this command.';
    return null;
};
