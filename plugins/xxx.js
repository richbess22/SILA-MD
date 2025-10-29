// XVIDEO DOWNLOAD COMMAND (LIST VERSION)

const { cmd } = require('../lib/command')
const { fetchJson } = require('../lib/functions')

const apilink = 'https://www.dark-yasiya-api.site/' // API LINK

cmd({
  pattern: "xv",
  alias: ["xxx", "sex"],
  react: "🔞",
  desc: "Search & download xvideo.com porn video",
  category: "download",
  use: ".xv <query>",
  filename: __filename
},
async (conn, mek, m, { from, reply, q }) => {
  try {
    if (!q) return await reply("⚡ *Please provide a search query!*")

    const xv_list = await fetchJson(`${apilink}/search/xvideo?text=${encodeURIComponent(q)}`)
    if (!xv_list.result || xv_list.result.length === 0) {
      return await reply("❌ No results found for your query!")
    }

    // only first 10 results
    const results = xv_list.result.slice(0, 10)

    let textMsg = `🔞 *NOVA X XVIDEO SEARCH*\n\n*Search Query:* ${q}\n\n_Select a video below to download:_\n\n`

    const sections = [
      {
        title: "📥 Available Videos",
        rows: results.map((v, i) => ({
          title: v.title,
          rowId: `.xvdl ${v.url}`,
          description: `👁 ${v.views} | 👍 ${v.like}`
        }))
      }
    ]

    await conn.sendMessage(from, {
      text: textMsg,
      footer: "🔞 Powered by Nova X",
      title: "NOVA X XVIDEO DOWNLOADER",
      buttonText: "📥 Select Video",
      sections
    }, { quoted: mek })

  } catch (error) {
    console.log("XVIDEO SEARCH ERROR:", error)
    reply("❌ Error: " + (error.message || error))
  }
})


// VIDEO DOWNLOAD COMMAND
cmd({
  pattern: "xvdl",
  react: "⬇️",
  desc: "Download xvideo by link",
  category: "download",
  use: ".xvdl <url>",
  filename: __filename
},
async (conn, mek, m, { from, reply, args }) => {
  try {
    const url = args[0]
    if (!url) return reply("⚡ Please provide a valid video URL!")

    const xv_info = await fetchJson(`${apilink}/download/xvideo?url=${encodeURIComponent(url)}`)
    if (!xv_info.result || !xv_info.result.dl_link) {
      return await reply("❌ Could not fetch video. Try another one.")
    }

    const msg = `
🔞 *NOVA X XVIDEO DOWNLOADER* 🔞

🥵 *Title* - ${xv_info.result.title || "Unknown"}
👁️ *Views* - ${xv_info.result.views || "N/A"}
👍 *Likes* - ${xv_info.result.like || "N/A"}
`

    await conn.sendMessage(from, {
      text: msg,
      contextInfo: {
        externalAdReply: {
          title: "Nova X Xvideo Downloader",
          body: "Selected video from search results",
          thumbnailUrl: xv_info.result.image,
          sourceUrl: url,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: mek })

    await conn.sendMessage(from, {
      document: { url: xv_info.result.dl_link },
      mimetype: "video/mp4",
      fileName: `${xv_info.result.title || "xvideo"}.mp4`,
      caption: xv_info.result.title || "Downloaded Video"
    }, { quoted: mek })

  } catch (error) {
    console.log("XVIDEO DL ERROR:", error)
    reply("❌ Error: " + (error.message || error))
  }
})
