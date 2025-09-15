const a = require("axios");
const b = require("fs");

module.exports = {
  config: {
    name: "tiktok",
    aliases: ["tt"],
    version: "0.0.2",
    author: "ArYAN",
    countDown: 5,
    role: 0,
    description: {
      en: "Search and download TikTok videos"
    },
    category: "media",
    guide: {
      en: "{pn} <keyword>\n\nExample:\n{pn} tomake chai"
    }
  },

  onStart: async function ({ api: c, event: d, args: e, commandName: f }) {
    if (!e[0]) return c.sendMessage("❌ Please provide a search keyword.", d.threadID, d.messageID);

    const g = e.join(" ");
    const h = `https://api-toop.onrender.com/aryan/tsearchv2?search=${encodeURIComponent(g)}&count=20`;

    try {
      const { data: i } = await a.get(h);
      if (!i.status || !i.data || i.data.length === 0) {
        return c.sendMessage("❌ No results found.", d.threadID, d.messageID);
      }

      const j = i.data.slice(0, 15); // শুধু 15টা দেখাবে

      let k = "🔎 TikTok Search Results (1–15):\n\n";
      j.forEach((l, m) => {
        k += `${m + 1}• ${l.title}\n`;
      });

      c.sendMessage(k + "\nReply with a number (1-15) to download.", d.threadID, (n, o) => {
        if (n) return;
        global.GoatBot.onReply.set(o.messageID, {
          commandName: f,
          messageID: o.messageID,
          author: d.senderID,
          results: j
        });
      }, d.messageID);

    } catch (p) {
      console.error(p);
      return c.sendMessage("❌ Failed to search TikTok.", d.threadID, d.messageID);
    }
  },

  onReply: async function ({ api: q, event: r, Reply: s }) {
    const { results: t, messageID: u } = s;
    const v = parseInt(r.body);

    if (isNaN(v) || v < 1 || v > t.length) {
      return q.sendMessage("❌ Invalid choice. Please reply with a number between 1 and 15.", r.threadID, r.messageID);
    }

    const w = t[v - 1];
    const x = `tiktok_${Date.now()}.mp4`;

    try {
      const y = await a.get(w.video, { responseType: "arraybuffer" });
      b.writeFileSync(x, Buffer.from(y.data));

      await q.unsendMessage(u);

      q.sendMessage(
        {
          body: `🎬 ${w.title}`,
          attachment: b.createReadStream(x)
        },
        r.threadID,
        () => b.unlinkSync(x),
        r.messageID
      );
    } catch (z) {
      console.error(z);
      return q.sendMessage("❌ Failed to download video.", r.threadID, r.messageID);
    }
  }
};
