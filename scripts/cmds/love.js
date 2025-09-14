module.exports = {
  config: {
    name: "love",
    version: "1.0.1",
    author: "Somrat",
    countDown: 2,
    role: 0,
    shortDescription: {
      en: "Romantic & cute auto reply"
    },
    description: {
      en: "Bot will reply with romantic/cute lines when certain keywords are detected"
    },
    category: "fun",
    guide: {
      en: "{pn} (this command works automatically when you type certain keywords)"
    }
  },

  onStart: async function () {
    console.log("❤️ Romantic & cute auto-reply module loaded!");
  },

  onChat: async function ({ event, api }) {
    if (!event.body) return;
    const msg = event.body.toLowerCase();

    const replies = {
        hi: ["ʜᴇʏ ᴍɪss ʀᴜ ʟᴏsᴛ ɪɴ ᴍʏ ʜᴇᴀʀᴛ? 💖"],
        hello: ["ʜᴇʏ ʟᴏᴠᴇ 😘, ᴀᴍɪ ᴛᴜᴍᴀʀ ᴅʀᴇᴀᴍ 💕"],
        "miss you": ["ᴛᴜᴍɪ ᴄʜᴀɴᴅ ɴᴀ, ᴛᴜᴍɪ ᴄʜᴀɴᴅᴇʀ ʀᴏꜱʜɴɪ ✨🥺"],
        "love you": [
            "ᴀᴍɪ ʜᴏɪᴛᴏ ᴄᴀʟᴇɴᴅᴇʀ ɴᴏɪ, ʙᴜᴛ ᴛᴜᴍɪ ᴀᴍᴀʀ ᴇᴠᴇʀʏ ᴅᴀʏ 😘",
            "ᴛᴜᴍɪ ᴍʏ ʜᴇᴀʀᴛ, ᴛʜᴇ ʙᴇsᴛ ᴘᴀʀᴛ ᴏғ ᴍʏ ᴅᴀʏ 💖"
        ],
        wifi: ["ᴛᴜᴍɪ ᴀᴍᴀʀ ᴡɪғɪ, ᴀᴍɪ ʜᴏʏᴛᴏ sɪɢɴᴀʟ… ᴛᴜᴍɪ ᴄʜᴀʀᴀ ᴀᴍᴀʀ ᴄᴏɴɴᴇᴄᴛɪᴏɴ ɴᴀɪ 😏📶"],
        somrat: ["ʜᴇʏ ʟᴏᴠᴇ, ᴀᴍɪ ᴛᴜᴍᴀʀ ʀᴏᴍᴀɴᴛɪᴄ ʙᴇʙ 😘💖"],
        goodmorning: [
            "ɢᴏᴏᴅ ᴍᴏʀɴɪɴɢ ʟᴏᴠᴇ 🌞💛, ᴀᴍᴀʀ ᴅɪɴ ᴛᴜᴍɪ ʙɪɴ ʟᴏɴɢ 😘",
            "ᴍᴏʀɴɪɴɢ ᴅᴀʀʟɪɴɢ ☀️💖, ᴀᴍɪ ᴛᴜᴍᴀʀ ʀᴀᴍᴘ ʜᴏʏᴛᴏ 😍"
        ],
        goodnight: [
            "ɢᴏᴏᴅɴɪɢʜᴛ ᴅᴀʀʟɪɴɢ 🌙💤, ᴅʀᴇᴀᴍ ᴀʙᴏᴜᴛ ᴍᴇ 😘❤️",
            "sʟᴇᴇᴘ ᴛɪɢʜᴛ ʟᴏᴠᴇ 💫, ᴛᴜᴍɪ ᴍʏ ʜᴇᴀʀᴛ ᴅʀᴇᴀᴍ 🥰"
        ],
        bye: ["ʙʏᴇ ʟᴏᴠᴇ 😘💖, ᴀᴍɪ ᴛᴜᴍᴀʀ ᴄʜᴀʀᴀ ɴᴏ ʜᴀᴘᴘʏ 😏💛"],
        "assalamo alykom": [
            "ᴀʟʏᴋᴏᴍ ᴡᴀʀᴀʜᴍᴀᴛᴜʟʟᴀʜ 💖, ʟᴏᴠᴇʏ ʜᴏᴡ ᴀʀᴇ ʏᴏᴜ 😘✨"
        ],
        morning: ["ᴍᴏʀɴɪɴɢ ʙᴀʙʏ 🌞💛, ᴀᴍɪ ᴛᴜᴍᴀʀ ᴛʀᴜᴇ ʜᴀᴘᴘʏ 😍"],
        night: ["ɴɪɢʜᴛ ʙᴀʙʏ 🌙💖, ᴅʀᴇᴀᴍ ᴏғ ᴍᴇ 😘"],
        darling: ["ʜᴇʏ ᴅᴀʀʟɪɴɢ 😘💛, ᴛᴜᴍɪ ᴀᴍᴀʀ ʜᴇᴀʀᴛ"],
        babe: ["ʜᴇʏ ʙᴀʙᴇ 💖, ᴛᴜᴍɪ ᴍʏ ʀᴏᴍᴀɴᴄᴇ 😘"],
        cutie: ["ʜᴇʏ ᴄᴜᴛɪᴇ 🥰💛, ᴀᴍɪ ᴛᴜᴍᴀʀ ʟᴏᴠᴇ"],
        angel: ["ʜᴇʏ ᴀɴɢᴇʟ 😇💖, ᴛᴜᴍɪ ᴍʏ ᴅʀᴇᴀᴍ 💛"],
        honey: ["ʜᴇʏ ʜᴏɴᴇʏ 🍯💖, ᴛᴜᴍɪ ᴀᴍᴀʀ ᴡᴏʀʟᴅ 😘"],
        sweetheart: ["ʜᴇʏ sᴡᴇᴇᴛʜᴇᴀʀᴛ 💕, ᴛᴜᴍɪ ᴍʏ ʀᴇᴀsᴏɴ 😍"]
    };

    for (let key in replies) {
        if (msg.includes(key)) {
            const response = replies[key][Math.floor(Math.random() * replies[key].length)];
            return api.sendMessage(response, event.threadID, event.messageID);
        }
    }
  }
};
