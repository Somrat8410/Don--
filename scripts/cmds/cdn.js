const ax = require("axios");

module.exports = {
  config: {
    name: "cdn",
    aliases: ["cd"],
    version: "0.0.1",
    author: "ArYAN",
    countDown: 5,
    role: 0,
    category: "media"
  },

  onStart: async ({ api, event }) => {
    try {
      const a = event.messageReply;

      if (!a?.attachments?.length) {
        return api.sendMessage("❌ Reply to a media file.", event.threadID, event.messageID);
      }

      const b = a.attachments[0].url;
      const c = "http://46.202.82.69:1398/upload/url";

      const d = await ax.post(c, { url: b }, { headers: { "Content-Type": "application/json" } });

      if (d.data?.link) {
        return api.sendMessage(d.data.link, event.threadID, event.messageID);
      } else {
        return api.sendMessage("❌ Upload failed.", event.threadID, event.messageID);
      }

    } catch (e) {
      console.error("❌ CDN", e.message);
      return api.sendMessage("❌ Failed to upload media.", event.threadID, event.messageID);
    }
  }
};
