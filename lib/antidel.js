const { isJidGroup } = require('@whiskeysockets/baileys');
const { loadMessage, getAnti } = require('../data');
const config = require('../settings');

const DeletedText = async (conn, mek, jid, deleteInfo, isGroup, update) => {
    const messageContent = mek.message?.conversation || mek.message?.extendedTextMessage?.text || 'Unknown content';
    deleteInfo += `\n◈ 𝙲𝙾𝙽𝚃𝙴𝙽𝚃 ━ ${messageContent}`;

    await conn.sendMessage(
        jid,
        {
            text: deleteInfo,
            contextInfo: {
                mentionedJid: isGroup ? [update.key.participant, mek.key.participant] : [update.key.remoteJid],
            },
        },
        { quoted: mek },
    );
};

const DeletedMedia = async (conn, mek, jid, deleteInfo) => {
    const antideletedmek = structuredClone(mek.message);
    const messageType = Object.keys(antideletedmek)[0];
    if (antideletedmek[messageType]) {
        antideletedmek[messageType].contextInfo = {
            stanzaId: mek.key.id,
            participant: mek.sender,
            quotedMessage: mek.message,
        };
    }
    if (messageType === 'imageMessage' || messageType === 'videoMessage') {
        antideletedmek[messageType].caption = deleteInfo;
    } else if (messageType === 'audioMessage' || messageType === 'documentMessage') {
        await conn.sendMessage(jid, { text: `*⚠️ 𝙳𝙴𝙻𝙴𝚃𝙴𝙳 𝙼𝙴𝚂𝚂𝙰𝙶𝙴 𝙰𝙻𝙴𝚁𝚃 🚨*\n${deleteInfo}` }, { quoted: mek });
    }
    await conn.relayMessage(jid, antideletedmek, {});
};

const AntiDelete = async (conn, updates) => {
    for (const update of updates) {
        if (update.update.message === null) {
            const store = await loadMessage(update.key.id);

            if (store && store.message) {
                const mek = store.message;
                const isGroup = isJidGroup(store.jid);
                const antiDeleteStatus = await getAnti();
                if (!antiDeleteStatus) continue;

                const deleteTime = new Date().toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                });

                let deleteInfo, jid;
                if (isGroup) {
                    const groupMetadata = await conn.groupMetadata(store.jid);
                    const groupName = groupMetadata.subject;
                    const sender = mek.key.participant?.split('@')[0];
                    const deleter = update.key.participant?.split('@')[0];

                    deleteInfo = `*╭────⬡ < | 𝐐ᴜᴇᴇɴ 𝐉ᴜꜱᴍʏ 𝐀ɴᴛɪ 𝐃ᴇʟᴇᴛᴇ 𝐒ʏꜱᴛᴇᴍ ❤‍🔥 ⬡────*
*├♻️ 𝚂𝙴𝙽𝙳𝙴𝚁:* @${sender}
*├👥 𝙶𝚁𝙾𝚄𝙿:* ${groupName}
*├⏰ 𝙳𝙴𝙻𝙴𝚃𝙴𝙳 𝚃𝙸𝙼𝙴:* ${deleteTime}
*├🗑️ 𝙳𝙴𝙻𝙴𝚃𝙴𝙳 𝙱𝚈:* @${deleter}
*├⚠️ 𝙰𝙲𝚃𝙸𝙾𝙽:* Deleted a Message 
*╰💬 𝙼𝙴𝚂𝚂𝙰𝙶𝙴:* Content Below 🔽`;
                    jid = config.ANTI_DEL_PATH === "inbox" ? conn.user.id : store.jid;
                } else {
                    const senderNumber = mek.key.remoteJid?.split('@')[0];
                    const deleterNumber = update.key.remoteJid?.split('@')[0];
                    
                    deleteInfo = `*╭────⬡ 🤖 < | 𝐐ᴜᴇᴇɴ 𝐉ᴜꜱᴍʏ 𝐀ɴᴛɪ 𝐃ᴇʟᴇᴛᴇ 𝐒ʏꜱᴛᴇᴍ ⬡────*
*├👤 𝚂𝙴𝙽𝙳𝙴𝚁:* @${senderNumber}
*├⏰ 𝙳𝙴𝙻𝙴𝚃𝙴 𝚃𝙸𝙼𝙴:* ${deleteTime}
*├⚠️ 𝙰𝙲𝚃𝙸𝙾𝙽:* Deleted a Message 
*╰💬 𝙼𝙴𝚂𝚂𝙰𝙶𝙴:* Content Below 🔽`;
                    jid = config.ANTI_DEL_PATH === "inbox" ? conn.user.id : update.key.remoteJid;
                }

                if (mek.message?.conversation || mek.message?.extendedTextMessage) {
                    await DeletedText(conn, mek, jid, deleteInfo, isGroup, update);
                } else {
                    await DeletedMedia(conn, mek, jid, deleteInfo);
                }
            }
        }
    }
};

module.exports = {
    DeletedText,
    DeletedMedia,
    AntiDelete,
};
