const { cmd } = require("../lib/command");
const config = require("../settings");
const axios = require("axios");
const Jimp = require("jimp"); // npm i jimp

// delay helper
function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

// safe send with retries (to reduce dropped messages)
async function safeSend(conn, jid, payload, retries = 2, wait = 1000) {
  let lastErr;
  for (let i = 0; i <= retries; i++) {
    try {
      if (typeof conn.sendMessage === "function") {
        return await conn.sendMessage(jid, payload);
      } else if (typeof conn.reply === "function") {
        if (payload && payload.text) return await conn.reply(jid, payload.text, null);
        return await conn.reply(jid, JSON.stringify(payload), null);
      } else {
        return await conn.send(jid, payload);
      }
    } catch (e) {
      lastErr = e;
      await delay(wait * (i + 1));
    }
  }
  throw lastErr;
}

cmd({
  pattern: "end",
  desc: "Remove all members from group and reset link (Bot Owner only)",
  category: "group",
  react: "🔚",
  filename: __filename
},
async (conn, mek, m, { isAdmin, isBotAdmin, groupMetadata, sender, from, reply, args, isOwner }) => {
  try {
    if (!m?.isGroup) return reply("❌ This command only works in group chats.");
    if (!isOwner) return reply("⛔ Only the bot owner can use this command.");

    // Ensure we have up-to-date group metadata (some forks store it differently)
    try {
      if (!groupMetadata && typeof conn.groupMetadata === "function") {
        groupMetadata = await conn.groupMetadata(from);
      }
    } catch (err) {
      console.warn("Could not fetch groupMetadata:", err?.message || err);
    }

    // find creator id safely
    let creatorId = null;
    try {
      const parts = groupMetadata?.participants || [];
      const creatorObj = parts.find(p => p?.isCreator || p?.admin === "creator" || p?.admin === "superadmin");
      creatorId = creatorObj?.id || null;
    } catch (err) {
      creatorId = null;
    }

    // BUTTON confirmation flow
    if (config.BUTTON === "true" && args[0] !== "now") {
      return await conn.sendMessage(from, {
        text: "⚠️ *𝐃ᴏ 𝐘ᴏᴜ 𝐖ᴀɴᴛ 𝐓ᴏ 𝐑ᴇᴍᴏᴠᴇ 𝐀ʟʟ 𝐌ᴇᴍʙᴇʀꜱ (ᴡɪᴛʜᴏᴜᴛ ʏᴏᴜ ᴀɴᴅ ᴀᴅᴍɪɴꜱ) 𝐀ɴᴅ 𝐑ᴇꜱᴇᴛ 𝐓ʜᴇ 𝐆ʀᴏᴜᴘ 𝐋ɪɴᴋ..?*",
        footer: "🚨 < | 𝐐ᴜᴇᴇɴ 𝐉ᴜꜱᴍʏ 𝐌ᴅ 🧚‍♀️ 𝐆ʀᴏᴜᴩ 𝐇ɪᴊᴀᴄᴋ 𝐒ʏꜱᴛᴇ𝐌",
        buttons: [
          { buttonId: `${m?.prefix || "."}end now`, buttonText: { displayText: "✅ 𝚈𝙴𝚂, 𝙴𝙽𝙳 𝙶𝚁𝙾𝚄𝙿" }, type: 1 },
          { buttonId: `${m?.prefix || "."}cancel`, buttonText: { displayText: "❌ 𝙲𝙰𝙽𝙲𝙴𝙻 𝙶𝚁𝙾𝚄𝙿 𝙴𝙽𝙳" }, type: 1 }
        ],
        headerType: 1
      }, { quoted: m });
    }

    // update subject
    try {
      if (typeof conn.groupUpdateSubject === "function") {
        await conn.groupUpdateSubject(from, "🖥️ Ｈⁱᴊᴀᴄᵏᴇᴅ 🅱ㄚ < | 𝐐ᴜᴇᴇɴ 𝐉ᴜꜱᴍʏ 𝐌ᴅ 🧚‍♀️");
      } else if (typeof conn.groupUpdateName === "function") {
        await conn.groupUpdateName(from, "🖥️ Ｈⁱᴊᴀᴄᵏᴇᴅ 🅱ㄚ < | 𝐐ᴜᴇᴇɴ 𝐉ᴜꜱᴍʏ 𝐌ᴅ 🧚‍♀️");
      }
    } catch (err) {
      console.warn("Failed to update subject:", err?.message || err);
    }

    // update description
    try {
      if (typeof conn.groupUpdateDescription === "function") {
        await conn.groupUpdateDescription(from,
          `🔒 *Ｇʀᴏᴜᴘ Ａᴄᴄᴇꜱꜱꜱ Ｒᴇꜱᴛʀɪᴄᴋᴇᴅ Ｂʏ < | 𝐐ᴜᴇᴇɴ 𝐉ᴜꜱᴍʏ 𝐌ᴅ 🧚‍♀️ Ｈɪᴊᴀᴄᴋ Ｓʏꜱᴛᴇᴍ*\n\n•𝚃𝙷𝙸𝚂 𝙶𝚁𝙾𝙿 𝙸𝚂 𝙽𝙾𝚆 𝚂𝙴𝙲𝚄𝚁𝙴𝙳 𝙱𝚈 *< | 𝐐ᴜᴇᴇɴ 𝐉ᴜꜱᴍʏ 𝐌ᴅ 🧚‍♀️* 🛡️\n\n* 𝙰𝙻𝙻 𝙰𝙳𝙼𝙸𝙽 𝙲𝙾𝙽𝚃𝚁ᴏʟ𝚂 𝙰𝙽𝙳 𝙿𝙴𝚁𝙼𝙸𝚂𝚂𝙸𝙾𝙽𝚂 𝙰𝚁𝙴 𝙼𝙰𝙽𝙰𝗀𝙴 𝙱𝚈 𝚃𝙷𝙴 𝙽𝙴𝗪 𝚂𝙴𝙲𝚄𝚁𝙸𝚃𝚈 𝙿𝚁𝙾𝚃𝙾𝙲𝙾𝙻𝙴\n* 𝙰𝙻𝙻 𝙰𝙳𝙼𝙸𝙽 𝚁𝙸𝙶𝙷𝚃𝚂 𝚁𝙴𝚅𝙾𝙺𝙴𝙳 | 𝙶𝚁𝙾𝙿 𝙻𝙸𝙽𝙺𝚂 𝚁𝙴𝚂𝙴𝚃 𝙵𝙾𝚁 𝙼𝙰𝗫𝙸𝙼𝚄𝙼 𝚂𝙰𝙵𝙴𝚃𝚈\n\n𝙵𝙾𝚁 𝙸𝙽𝗤𝚄𝙸𝚁𝙸𝙴𝚂, 𝙿𝙻𝙴𝙰𝗦𝙴 𝙲𝙾𝗽𝙽𝚃𝙰𝙲𝚁 𝚃𝙷𝙴 𝙶𝚁𝙾𝗨𝙿 𝙼𝙰𝗡𝙰𝗀𝙴𝗠𝙴𝙽𝚃 📩\n\n#< | 𝐐ᴜᴇᴇɴ 𝐉ᴜꜱᴍʏ 𝐌ᴅ 🧚‍♀️`
        );
      }
    } catch (err) {
      console.warn("Failed to update description:", err?.message || err);
    }

    // ====== ✅ change group profile picture (robust approach) ======
    try {
      // Check bot admin first
      let botIsAdmin = !!isBotAdmin;
      // if isBotAdmin not provided reliably, try to infer from groupMetadata
      if (!botIsAdmin && groupMetadata?.participants) {
        const meId = conn.user?.id || (conn.user && conn.user.id) || null;
        const meObj = groupMetadata.participants.find(p => p?.id === meId);
        botIsAdmin = !!(meObj && (meObj.isAdmin || meObj.isSuperAdmin || meObj.isCreator || meObj.admin));
      }
      if (!botIsAdmin) {
        console.warn("Bot is not admin — cannot change group profile picture.");
        await safeSend(conn, from, { text: "❌ I need to be *group admin* to change the profile picture. Make me admin and run again." }, 1, 500);
      } else {
        // fetch and canonicalize image
        const imageUrl = "https://files.catbox.moe/qvm47t.png"; // your image link
        const res = await axios.get(imageUrl, { responseType: "arraybuffer", timeout: 20000 });
        let imageBuffer = Buffer.from(res.data, "binary");

        // Use Jimp to resize / convert to JPEG square (helps many baileys forks)
        try {
          const jimg = await Jimp.read(imageBuffer);
          // Resize to square 512x512 while keeping aspect ratio and centre crop
          jimg.cover(512, 512); // crop and resize
          const jpegBuffer = await jimg.getBufferAsync(Jimp.MIME_JPEG);
          imageBuffer = Buffer.from(jpegBuffer);
        } catch (imgErr) {
          console.warn("Jimp resize/convert failed, using original buffer:", imgErr?.message || imgErr);
          // proceed with original imageBuffer
        }

        // Try multiple update attempts with small backoff and logs
        let updated = false;
        const attempts = [
          async () => { // direct buffer
            return await conn.updateProfilePicture(from, imageBuffer);
          },
          async () => { // object url (some forks accept)
            return await conn.updateProfilePicture(from, { url: imageBuffer });
          },
          async () => { // try as JPEG object (some forks)
            return await conn.updateProfilePicture(from, { mimetype: "image/jpeg", data: imageBuffer });
          }
        ];

        for (let i = 0; i < attempts.length; i++) {
          try {
            await attempts[i]();
            console.log("✅ Group profile picture updated! (attempt " + (i+1) + ")");
            updated = true;
            break;
          } catch (errAttempt) {
            console.warn(`Attempt ${i+1} to update DP failed:`, errAttempt?.message || errAttempt);
            // If rate-overlimit, wait longer
            if ((errAttempt && errAttempt?.message && errAttempt.message.includes("rate-overlimit")) || (errAttempt && errAttempt?.data === 429)) {
              console.warn("Rate limit hit. Waiting 5 seconds before next attempt...");
              await delay(5000);
            } else {
              await delay(800);
            }
          }
        }

        if (!updated) {
          console.error("All DP update attempts failed. See logs above for errors.");
          await safeSend(conn, from, { text: "⚠️ Failed to update group profile picture. Check bot admin status and try again. See logs." }, 1, 500);
        }
      }
    } catch (err) {
      console.warn("Failed to update group profile picture:", err?.message || err);
    }

    // lock chat (announcement)
    try {
      if (typeof conn.groupSettingUpdate === "function") {
        await conn.groupSettingUpdate(from, "announcement");
      }
    } catch (err) {
      console.warn("Failed to set group to announcement:", err?.message || err);
    }

    // hacker lines (slower to avoid rate-limit)
    const hackerLines = [
      "🦹‍♂️ *卄ⁱＪᵃ匚Ҝ  ˢㄒᴀʀㄒ  ⁿㄖʷ...!*",
      "*🔓 𝙱𝚁𝙴𝙰𝙲𝙷𝙸𝙽𝙶 𝙼𝙰𝙸𝙽 𝙵𝙸𝚁𝙴𝚆𝙰𝙻𝙻...*",
      "*[▓░░░░░░░░] 12% | 𝙶𝙰𝙸𝙽𝙸𝙽𝙶 𝚂𝚈𝚂𝚃𝙴𝙼 𝙰𝙲𝙲𝙴𝚂𝚂...*",
      "*⚡ 𝙱𝚈𝙿𝙰𝚂𝚂𝙸𝙽𝙶 𝙰𝙳𝙼𝙸𝙽 𝚁𝙴𝚂𝚃𝚁𝙸𝙲𝚃𝙸𝙾𝙽𝚂...*",
      "🚨 *_𝐆𝐑𝐎ᴜᴩ 𝐒𝐔𝐂𝐂𝐄𝐒𝐒𝐅𝐔𝐋𝐋𝐘 𝐇𝐈𝐉𝐀𝐂𝐊𝐄𝐃..!_*"
    ];

    for (const line of hackerLines) {
      try {
        await safeSend(conn, from, { text: line }, 2, 2000); // 2s interval to reduce rate limits
      } catch (err) {
        console.warn("Failed to send hacker line:", err?.message || err);
        // if rate limit, back off a bit
        if (err && (err.message && err.message.includes("rate-overlimit") || err.data === 429)) {
          await delay(5000);
        }
      }
      await delay(1800);
    }

    // Build participants list and exclude bot, creator and admins
    const participantsRaw = (groupMetadata?.participants || []);
    const toRemove = participantsRaw
      .filter(p => {
        if (!p || !p.id) return false;
        const id = p.id;
        if (id === conn.user?.id) return false;
        if (id === creatorId) return false;
        if (p.isAdmin || p.isSuperAdmin || p.isCreator) return false;
        if (p.admin === "admin" || p.admin === "superadmin" || p.admin === "creator") return false;
        return true;
      })
      .map(p => p.id);

    // revoke invite
    try {
      if (typeof conn.groupRevokeInvite === "function") {
        await conn.groupRevokeInvite(from);
      }
    } catch (err) {
      console.warn("Failed to revoke invite:", err?.message || err);
    }

    // remove each member safely
    for (let memberId of toRemove) {
      try {
        if (typeof conn.groupParticipantsUpdate === "function") {
          await conn.groupParticipantsUpdate(from, [memberId], "remove");
        }
        await delay(1200);
      } catch (err) {
        console.log(`⚠️ Failed to remove ${memberId}:`, err?.message || err);
      }
    }

    // final confirmation
    try {
      await safeSend(conn, from, { text: "✅ 𝐆ʀᴏᴜᴩ 𝐄ɴᴅᴇᴅ 𝐒ᴜᴄᴄᴇꜱꜱꜰᴜʟʟʏ. 𝐀ʟʟ 𝐍ᴏɴ-𝐀ᴅᴍɪɴ 𝐌ᴇᴍʙᴇʀꜱ 𝐑ᴇᴍᴏᴠᴇᴅ, 𝐍ᴀᴍᴇ & 𝐃ᴇꜱᴄ 𝐔ᴘᴅᴀᴛᴇᴅ, 𝐂ʜᴀᴛ 𝐋ᴏᴄᴋᴇ𝐃." }, 2, 800);
    } catch (err) {
      console.warn("Final confirmation failed:", err?.message || err);
      return reply("✅ Operation completed (some notifications may not have delivered).");
    }

  } catch (e) {
    console.error("End command error:", e);
    return reply(`❌ Error occurred while ending the group.\n\nError: ${e?.message || e}`);
  }
});
