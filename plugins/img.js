const { cmd } = require("../lib/command");
const axios = require("axios");
const cheerio = require("cheerio");
const config = require("../settings");

cmd({
    pattern: "img",
    alias: ["image", "searchimg", "photo"],
    react: "🖼️",
    desc: "Search and download high-quality images from multiple sources",
    category: "fun",
    use: ".img <keywords> [page]",
    filename: __filename
}, async (conn, mek, m, { reply, args, from }) => {
    try {
        if (!args.length) return reply("🖼️ Usage: .img <query> [page]\nExample: .img cute cats 2");

        const pageArg = args[args.length - 1];
        const page = isNaN(pageArg) ? 1 : parseInt(pageArg);
        const query = isNaN(pageArg) ? args.join(" ") : args.slice(0, -1).join(" ");

        await reply(`🔍 Searching images for *${query}* (Page ${page}) ...`);

        // ======= 1️⃣ Google Images =======
        const googleUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}&start=${(page-1)*20}`;
        const { data: gData } = await axios.get(googleUrl, {
            headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
        });
        const $ = cheerio.load(gData);
        let images = [];
        $("img").each((i, el) => {
            const img = $(el).attr("data-iurl") || $(el).attr("data-src") || $(el).attr("src");
            if (img && img.startsWith("http")) images.push(img);
        });

        // ======= 2️⃣ Unsplash API =======
        try {
            const unsplashRes = await axios.get(`https://source.unsplash.com/featured/800x800/?${encodeURIComponent(query)}`);
            if (unsplashRes.request.res.responseUrl) images.push(unsplashRes.request.res.responseUrl);
        } catch(e) { }

        // ======= 3️⃣ Pixabay =======
        try {
            const pixabayRes = await axios.get(`https://pixabay.com/images/search/${encodeURIComponent(query)}/?pagi=${page}`);
            const $$ = cheerio.load(pixabayRes.data);
            $$("img").each((i, el) => {
                const img = $$(el).attr("data-src") || $$(el).attr("src");
                if (img && img.startsWith("http")) images.push(img);
            });
        } catch(e) { }

        if (!images.length) return reply("❌ No images found. Try another keyword or page.");

        // Take unique & top 10 images
        images = [...new Set(images)].slice(0, 10);

        for (const imgUrl of images) {
            await conn.sendMessage(from, {
                image: { url: imgUrl },
                caption: `📷 Result for: *${query}*\n📄 Page: ${page}\n\n${config.FOOTER}`
            }, { quoted: mek });
            await new Promise(r => setTimeout(r, 1200));
        }

        // Pagination buttons
        if (config.BUTTON === 'true') {
            let buttons = [];
            if (page > 1) buttons.push({ buttonId: `.img ${query} ${page-1}`, buttonText: { displayText: "⏮ Prev" }, type: 1 });
            buttons.push({ buttonId: `.img ${query} ${page+1}`, buttonText: { displayText: "⏭ Next" }, type: 1 });
            await conn.sendMessage(from, {
                text: `🔎 Results for *${query}* - Page ${page}`,
                footer: config.FOOTER,
                buttons,
                headerType: 2
            }, { quoted: mek });
        }

    } catch (error) {
        console.error("Multi-Source Image Error:", error);
        reply(`❌ Error: ${error.message || "Failed to fetch images"}`);
    }
});
