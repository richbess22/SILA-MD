require('dotenv').config();
const settings = require('./settings');
const { Boom } = require('@hapi/boom')
const fs = require('fs')
const chalk = require('chalk')
const FileType = require('file-type')
const path = require('path')
const axios = require('axios')
const { handleMessages, handleGroupParticipantUpdate, handleStatus } = require('./main');
const PhoneNumber = require('awesome-phonenumber')
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./lib/exif')
const { smsg, isUrl, generateMessageTag, getBuffer, getSizeMedia, fetch, sleep, reSize } = require('./lib/myfunc')
const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    generateForwardMessageContent,
    prepareWAMessageMedia,
    generateWAMessageFromContent,
    generateMessageID,
    downloadContentFromMessage,
    jidDecode,
    proto,
    jidNormalizedUser,
    makeCacheableSignalKeyStore,
    delay
} = require("@whiskeysockets/baileys")
const NodeCache = require("node-cache")
const pino = require("pino")
const readline = require("readline")
const { parsePhoneNumber } = require("libphonenumber-js")
const { PHONENUMBER_MCC } = require('@whiskeysockets/baileys/lib/Utils/generics')
const { rmSync, existsSync } = require('fs')
const { join } = require('path')

// Import lightweight store
const store = require('./lib/lightweight_store')

// Initialize store
store.readFromFile()
setInterval(() => store.writeToFile(), settings.storeWriteInterval || 10000)

// Memory optimization - Force garbage collection if available
setInterval(() => {
    if (global.gc) {
        global.gc()
        console.log('🧹 Garbage collection completed')
    }
}, 60_000)

// Memory monitoring - Restart if RAM gets too high
setInterval(() => {
    const used = process.memoryUsage().rss / 1024 / 1024
    if (used > 400) {
        console.log('⚠️ RAM too high (>400MB), restarting bot...')
        process.exit(1)
    }
}, 30_000)

let phoneNumber = "255612491554"
let owner = JSON.parse(fs.readFileSync('./data/owner.json'))

global.botname = "SILA MD"
global.themeemoji = "•"
const pairingCode = !!phoneNumber || process.argv.includes("--pairing-code")
const useMobile = process.argv.includes("--mobile")

// Only create readline interface if we're in an interactive environment
const rl = process.stdin.isTTY ? readline.createInterface({ input: process.stdin, output: process.stdout }) : null
const question = (text) => {
    if (rl) {
        return new Promise((resolve) => rl.question(text, resolve))
    } else {
        return Promise.resolve(settings.ownerNumber || phoneNumber)
    }
}

//===================SESSION-AUTH============================
if (!fs.existsSync(__dirname + '/sessions/creds.json')) {
    if(!process.env.SESSION_ID) {
        console.log(chalk.red('❌ Please add your session to SESSION_ID environment variable!'));
        console.log(chalk.yellow('💡 How to fix:'));
        console.log(chalk.yellow('1. Create a .env file in your project root'));
        console.log(chalk.yellow('2. Add: SESSION_ID=your_session_id_here'));
        console.log(chalk.yellow('3. Restart the bot'));
        process.exit(1);
    }
    
    const sessdata = process.env.SESSION_ID.replace("Silva~", '');
    
    console.log(chalk.yellow('📥 Downloading session file...'));
    axios.get(`https://mega.nz/file/${sessdata}`, {
        responseType: 'arraybuffer'
    })
    .then(response => {
        fs.writeFile(__dirname + '/sessions/creds.json', response.data, (err) => {
            if (err) {
                console.log(chalk.red('❌ Error saving session file:', err.message));
                return;
            }
            console.log(chalk.green("✅ Session downloaded successfully"));
        });
    })
    .catch(error => {
        console.log(chalk.red('❌ Error downloading session:', error.message));
        console.log(chalk.yellow('💡 Make sure your SESSION_ID is correct'));
        
        fs.writeFileSync(__dirname + '/sessions/creds.json', JSON.stringify({}));
        console.log(chalk.yellow('📁 Created empty session file, will use pairing code instead'));
    });
}

console.log(chalk.green(`🚀 ${global.botname} is starting...`));
  
//=============================================

async function startSilaBotInc() {
    let { version, isLatest } = await fetchLatestBaileysVersion()
    const { state, saveCreds } = await useMultiFileAuthState(`./session`)
    const msgRetryCounterCache = new NodeCache()

    const SilaBotInc = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: !pairingCode,
        browser: ["Ubuntu", "Chrome", "20.0.04"],
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
        },
        markOnlineOnConnect: true,
        generateHighQualityLinkPreview: true,
        syncFullHistory: true,
        getMessage: async (key) => {
            let jid = jidNormalizedUser(key.remoteJid)
            let msg = await store.loadMessage(jid, key.id)
            return msg?.message || ""
        },
        msgRetryCounterCache,
        defaultQueryTimeoutMs: undefined,
    })

    store.bind(SilaBotInc.ev)

    // Setup channel reactions
    setupChannelReactions(SilaBotInc);

    // Message handling
    SilaBotInc.ev.on('messages.upsert', async chatUpdate => {
        try {
            const mek = chatUpdate.messages[0]
            if (!mek.message) return
            mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
            if (mek.key && mek.key.remoteJid === 'status@broadcast') {
                await handleStatus(SilaBotInc, chatUpdate);
                return;
            }
            if (!SilaBotInc.public && !mek.key.fromMe && chatUpdate.type === 'notify') return
            if (mek.key.id.startsWith('BAE5') && mek.key.id.length === 16) return

            if (SilaBotInc?.msgRetryCounterCache) {
                SilaBotInc.msgRetryCounterCache.clear()
            }

            try {
                await handleMessages(SilaBotInc, chatUpdate, true)
            } catch (err) {
                console.error("Error in handleMessages:", err)
                if (mek.key && mek.key.remoteJid) {
                    await SilaBotInc.sendMessage(mek.key.remoteJid, {
                        text: '❌ An error occurred while processing your message.',
                        contextInfo: {
                            forwardingScore: 1,
                            isForwarded: true,
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: settings.newsletterJid,
                                newsletterName: 'SILA TECH',
                                serverMessageId: -1
                            }
                        }
                    }).catch(console.error);
                }
            }
        } catch (err) {
            console.error("Error in messages.upsert:", err)
        }
    })

    SilaBotInc.decodeJid = (jid) => {
        if (!jid) return jid
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {}
            return decode.user && decode.server && decode.user + '@' + decode.server || jid
        } else return jid
    }

   SilaBotInc.ev.on('contacts.update', update => {
        for (let contact of update) {
            let id = SilaBotInc.decodeJid(contact.id)
            if (store && store.contacts) store.contacts[id] = { id, name: contact.notify }
        }
    })

    SilaBotInc.getName = (jid, withoutContact = false) => {
        id = SilaBotInc.decodeJid(jid)
        withoutContact = SilaBotInc.withoutContact || withoutContact
        let v
        if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
            v = store.contacts[id] || {}
            if (!(v.name || v.subject)) v = SilaBotInc.groupMetadata(id) || {}
            resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
        })
        else v = id === '0@s.whatsapp.net' ? {
            id,
            name: 'WhatsApp'
        } : id === SilaBotInc.decodeJid(SilaBotInc.user.id) ?
            SilaBotInc.user :
            (store.contacts[id] || {})
        return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
    }

    SilaBotInc.public = true

    SilaBotInc.serializeM = (m) => smsg(SilaBotInc, m, store)

    // Handle pairing code
    if (pairingCode && !SilaBotInc.authState.creds.registered) {
        if (useMobile) throw new Error('Cannot use pairing code with mobile api')

        let phoneNumber
        if (!!global.phoneNumber) {
            phoneNumber = global.phoneNumber
        } else {
            phoneNumber = await question(chalk.bgBlack(chalk.greenBright(`Please type your WhatsApp number 😍\nFormat: 255612491554 (without + or spaces) : `)))
        }

        phoneNumber = phoneNumber.replace(/[^0-9]/g, '')

        const pn = require('awesome-phonenumber');
        if (!pn('+' + phoneNumber).isValid()) {
            console.log(chalk.red('Invalid phone number. Please enter your full international number (e.g., 255612491554 for Tanzania) without + or spaces.'));
            process.exit(1);
        }

        setTimeout(async () => {
            try {
                let code = await SilaBotInc.requestPairingCode(phoneNumber)
                code = code?.match(/.{1,4}/g)?.join("-") || code
                console.log(chalk.black(chalk.bgGreen(`Your Pairing Code : `)), chalk.black(chalk.white(code)))
                console.log(chalk.yellow(`\nPlease enter this code in your WhatsApp app:\n1. Open WhatsApp\n2. Go to Settings > Linked Devices\n3. Tap "Link a Device"\n4. Enter the code shown above`))
            } catch (error) {
                console.error('Error requesting pairing code:', error)
                console.log(chalk.red('Failed to get pairing code. Please check your phone number and try again.'))
            }
        }, 3000)
    }

    // Connection handling
    SilaBotInc.ev.on('connection.update', async (s) => {
        const { connection, lastDisconnect } = s
        if (connection == "open") {
            console.log(chalk.magenta(` `))
            console.log(chalk.yellow(`🌿Connected to => ` + JSON.stringify(SilaBotInc.user, null, 2)))

            // Set random auto bio
try {
    const randomBio = settings.autoBio[Math.floor(Math.random() * settings.autoBio.length)];
    await SilaBotInc.updateProfileStatus(randomBio);
    console.log('✅ Auto bio set successfully:', randomBio);
} catch (error) {
    console.log('❌ Failed to set auto bio:', error.message);
}

            // Auto join groups and follow channels
            await autoJoinGroupsAndChannels(SilaBotInc);

            const botNumber = SilaBotInc.user.id.split(':')[0] + '@s.whatsapp.net';
            await SilaBotInc.sendMessage(botNumber, {
                text: `*╭━━━〔 🐢 𝚂𝙸𝙻𝙰 𝙼𝙳 🐢 〕━━━┈⊷*\n*┃🐢│ 𝙱𝙾𝚃 𝙲𝙾𝙽𝙽𝙴𝙲𝚃𝙴𝙳 𝚂𝚄𝙲𝙲𝙴𝚂𝚂𝙵𝚄𝙻𝙻𝚈!*\n*┃🐢│ 𝚃𝙸𝙼𝙴 :❯ ${new Date().toLocaleString()}*\n*┃🐢│ 𝚂𝚃𝙰𝚃𝚄𝚂 :❯ 𝙾𝙽𝙻𝙸𝙽𝙴 𝙰𝙽𝙳 𝚁𝙴𝙰𝙳𝚈!*\n*╰━━━━━━━━━━━━━━━┈⊷*`,
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: settings.newsletterJid,
                        newsletterName: 'SILA TECH',
                        serverMessageId: -1
                    }
                }
            });

            await delay(1999)
            console.log(chalk.yellow(`\n\n                  ${chalk.bold.blue(`[ ${global.botname || 'SILA MD'} ]`)}\n\n`))
            console.log(chalk.cyan(`< ================================================== >`))
            console.log(chalk.magenta(`\n${global.themeemoji || '•'} YT SILATRIX22`))
            console.log(chalk.magenta(`${global.themeemoji || '•'} GITHUB: Sila-Md`))
            console.log(chalk.magenta(`${global.themeemoji || '•'} WA NUMBER: ${owner}`))
            console.log(chalk.magenta(`${global.themeemoji || '•'} CREDIT: SILA`))
            console.log(chalk.green(`${global.themeemoji || '•'} 🤖 Bot Connected Successfully! ✅`))
            console.log(chalk.blue(`Bot Version: ${settings.version}`))
        }
        if (connection === 'close') {
            const statusCode = lastDisconnect?.error?.output?.statusCode
            if (statusCode === DisconnectReason.loggedOut || statusCode === 401) {
                try {
                    rmSync('./session', { recursive: true, force: true })
                } catch { }
                console.log(chalk.red('Session logged out. Please re-authenticate.'))
                startSilaBotInc()
            } else {
                startSilaBotInc()
            }
        }
    })

    // Track recently-notified callers to avoid spamming messages
    const antiCallNotified = new Set();

    // Anticall handler: block callers when enabled
    SilaBotInc.ev.on('call', async (calls) => {
        try {
            const { readState: readAnticallState } = require('./commands/anticall');
            const state = readAnticallState();
            if (!state.enabled) return;
            for (const call of calls) {
                const callerJid = call.from || call.peerJid || call.chatId;
                if (!callerJid) continue;
                try {
                    try {
                        if (typeof SilaBotInc.rejectCall === 'function' && call.id) {
                            await SilaBotInc.rejectCall(call.id, callerJid);
                        } else if (typeof SilaBotInc.sendCallOfferAck === 'function' && call.id) {
                            await SilaBotInc.sendCallOfferAck(call.id, callerJid, 'reject');
                        }
                    } catch {}

                    if (!antiCallNotified.has(callerJid)) {
                        antiCallNotified.add(callerJid);
                        setTimeout(() => antiCallNotified.delete(callerJid), 60000);
                        await SilaBotInc.sendMessage(callerJid, { text: '📵 Anticall is enabled. Your call was rejected and you will be blocked.' });
                    }
                } catch {}
                setTimeout(async () => {
                    try { await SilaBotInc.updateBlockStatus(callerJid, 'block'); } catch {}
                }, 800);
            }
        } catch (e) {
        }
    });

    SilaBotInc.ev.on('creds.update', saveCreds)

    SilaBotInc.ev.on('group-participants.update', async (update) => {
        await handleGroupParticipantUpdate(SilaBotInc, update);
    });

    SilaBotInc.ev.on('messages.upsert', async (m) => {
        if (m.messages[0].key && m.messages[0].key.remoteJid === 'status@broadcast') {
            await handleStatus(SilaBotInc, m);
        }
    });

    SilaBotInc.ev.on('status.update', async (status) => {
        await handleStatus(SilaBotInc, status);
    });

    SilaBotInc.ev.on('messages.reaction', async (status) => {
        await handleStatus(SilaBotInc, status);
    });

    return SilaBotInc
}

// Function to setup channel reactions
function setupChannelReactions(socket) {
    socket.ev.on('messages.upsert', async ({ messages }) => {
        const message = messages[0];
        if (!message?.key || message.key.remoteJid !== settings.newsletterJid) return;

        try {
            const emojis = settings.autoReactions.channelReaction;
            const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
            const messageId = message.newsletterServerId;

            if (!messageId) return;

            let retries = 3;
            while (retries > 0) {
                try {
                    await socket.newsletterReactMessage(
                        settings.newsletterJid,
                        messageId.toString(),
                        randomEmoji
                    );
                    console.log(`✅ Reacted to channel message ${messageId} with ${randomEmoji}`);
                    break;
                } catch (error) {
                    retries--;
                    console.warn(`❌ Failed to react to channel message, retries left: ${retries}`, error.message);
                    if (retries === 0) throw error;
                    await delay(2000);
                }
            }
        } catch (error) {
            console.error('❌ Channel reaction error:', error);
        }
    });
}

// Function to auto join groups and channels
async function autoJoinGroupsAndChannels(socket) {
    try {
        const groups = [
            settings.botUserGroup,
            settings.silaTechGroup
        ];

        const channels = [
            settings.newsletterJid
        ];

        // Join groups
        for (const groupLink of groups) {
            try {
                const inviteCode = groupLink.match(/chat\.whatsapp\.com\/([a-zA-Z0-9]+)/)?.[1];
                if (inviteCode) {
                    await socket.groupAcceptInvite(inviteCode);
                    console.log(`✅ Joined group: ${groupLink}`);
                }
            } catch (error) {
                console.log(`❌ Failed to join group: ${groupLink}`, error.message);
            }
            await delay(2000);
        }

        // Follow channels
        for (const channelId of channels) {
            try {
                await socket.newsletterFollow(channelId);
                console.log(`✅ Followed channel: ${channelId}`);
            } catch (error) {
                console.log(`❌ Failed to follow channel: ${channelId}`, error.message);
            }
            await delay(2000);
        }

    } catch (error) {
        console.error('❌ Auto-join setup error:', error);
    }
}

// Start the bot with error handling
startSilaBotInc().catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
})
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err)
})

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err)
})

let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(chalk.redBright(`Update ${__filename}`))
    delete require.cache[file]
    require(file)
})