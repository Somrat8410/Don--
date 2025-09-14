module.exports.config = {
  name: "autoreply",
  version: "2.1.0",
  role: 0,
  credits: "Somrat",
  description: "Goat Bot Romantic & Cute front-style Unicode auto-reply",
  usages: "Upload and restart bot",
  cooldowns: 2,
};

// Required empty onStart function for Goat Bot
module.exports.onStart = async function () {
  // Nothing needed here, just required by Goat Bot
};

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Front-style Unicode & emojis replies
const replies = {
  hi: [
    "ʜᴇʏ ʙᴀʙʏ, ʏᴏᴜ ʀᴏᴄᴋ ᴍʏ ᴡᴏʀʟᴅ 💖",
    "ʜɪ ᴊᴀɴ! ʏᴏᴜʀ ꜱᴍɪʟᴇ ʟɪɢʜᴛs ᴜᴘ ᴍʏ ᴅᴀʏ 🌸",
    "ʜᴇʏ! ᴍɪssᴇᴅ ʏᴏᴜ 😘✨"
  ],
  hello: [
    "ʜᴇʟʟᴏ ʙᴀʙʏ 😘💖, ʏᴏᴜ ᴍᴀᴋᴇ ᴍʏ ʜᴇᴀʀᴛ sᴋɪᴘ ᴀ ʙᴇᴀᴛ!",
    "ʜᴇʏ ʙᴇᴀᴜᴛɪꜰᴜʟ 🌸, ᴛʜɪɴᴋɪɴɢ ᴏғ ʏᴏᴜ ᴀʟᴡᴀʏs 🥰"
  ],
  love: [
    "ᴍʏ ʜᴇᴀʀᴛ ʙᴇᴀᴛs ꜰᴏʀ ʏᴏᴜ 💞",
    "ɪ ʟᴏᴠᴇ ʏᴏᴜ ᴛᴏ ᴛʜᴇ ᴍᴏᴏɴ ᴀɴᴅ ʙᴀᴄᴋ 🌙",
    "ʏᴏᴜ ᴀʀᴇ ᴍʏ ᴇᴠᴇʀʏᴛʜɪɴɢ ❤️",
    "ɪ ᴄᴀɴ'ᴛ sᴛᴏᴘ ᴛʜɪɴᴋɪɴɢ ᴀʙᴏᴜᴛ ʏᴏᴜ 🥰"
  ],
  miss: [
    "ᴍɪssɪɴɢ ʏᴏᴜ ʙᴀᴅʟʏ 🥺💖",
    "ᴛʜᴏᴜɢʜᴛs ᴏғ ʏᴏᴜ ᴋᴇᴇᴘ ᴍʏ ʜᴇᴀʀᴛ ᴡᴀʀᴍ 🔥",
    "ᴄᴀɴ'ᴛ ᴡᴀɪᴛ ᴛᴏ ʜᴜɢ ʏᴏᴜ ᴀɢᴀɪɴ 🤗"
  ],
  kiss: [
    "ʏᴏᴜʀ ʟɪᴘs ᴀʀᴇ ᴍʏ ᴡᴇᴀᴘᴏɴ 😘💋",
    "ɢɪᴠᴇ ᴍᴇ ᴀ sᴡᴇᴇᴛ ᴋɪss 💖✨"
  ],
  bye: [
    "ʙʏᴇ ʙᴀʙʏ, ᴄᴀɴ'ᴛ ᴡᴀɪᴛ ᴛᴏ ᴛᴀʟᴋ ᴀɢᴀɪɴ 💔",
    "sᴇᴇ ʏᴏᴜ sᴏᴏɴ 😘"
  ],
  goodnight: [
    "ɢᴏᴏᴅ ɴɪɢʜᴛ ʟᴏᴠᴇ, sᴡᴇᴇᴛ ᴅʀᴇᴀᴍs 🌙💖",
    "sʟᴇᴇᴘ ᴛɪɢʜᴛ 😘✨"
  ],
  goodmorning: [
    "ɢᴏᴏᴅ ᴍᴏʀɴɪɴɢ ʙᴀʙʏ ☀️💞",
    "ᴡᴀᴋᴇ ᴜᴘ, ᴍʏ sᴜɴsʜɪɴᴇ 🌸"
  ],
  smile: [
    "ʏᴏᴜʀ sᴍɪʟᴇ ᴜɴʟᴏᴄᴋs ᴍʏ ʜᴇᴀʀᴛ 🔐💖",
    "ᴋᴇᴇᴘ sᴍɪʟɪɴɢ, ᴍʏ ʟᴏᴠᴇ 🌸"
  ],
  cute: [
    "ʏᴏᴜ ᴀʀᴇ ᴛᴏᴏ ᴄᴜᴛᴇ 🥰",
    "ᴄᴜᴛᴇsᴛ ʜᴜᴍᴀɴ ᴀʟɪᴠᴇ 😻"
  ],
  romantic: [
    "ɪ ᴡᴀɴᴛ ᴛᴏ ʜᴏʟᴅ ʏᴏᴜ ꜰᴏʀᴇᴠᴇʀ 🤗💖",
    "ʏᴏᴜ ᴀʀᴇ ᴍʏ ʜᴇᴀʀᴛ'ꜱ ᴏɴʟʏ ᴅᴇsɪʀᴇ 💓"
  ],
  somrat: [
    "ᴏʜ sᴏᴍʀᴀᴛ! ʟᴏᴏᴋs ʟɪᴋᴇ sᴏᴍᴇᴏɴᴇ ᴊᴜsᴛ ɢᴏᴛ ᴀ ɢғ 😘💖",
    "sᴏᴍʀᴀᴛ ɪs ᴏꜰꜰɪᴄɪᴀʟʟʏ ᴛᴀᴋᴇɴ! ❤️🥰",
    "ᴄᴏɴɢʀᴀᴛs sᴏᴍʀᴀᴛ, ʏᴏᴜʀ ʜᴇᴀʀᴛ ᴊᴜsᴛ ꜰᴏᴜɴᴅ ɪᴛs ᴍᴀᴛᴄʜ 💞✨"
  ]
};

module.exports.handleEvent = async function ({ event, api }) {
  if (!event || !event.body) return;
  const msg = event.body.toLowerCase();

  // Mapping triggers
  if (msg.includes("hi")) return api.sendMessage(pick(replies.hi), event.threadID, event.messageID);
  if (msg.includes("hello")) return api.sendMessage(pick(replies.hello), event.threadID, event.messageID);
  if (msg.includes("love")) return api.sendMessage(pick(replies.love), event.threadID, event.messageID);
  if (msg.includes("miss")) return api.sendMessage(pick(replies.miss), event.threadID, event.messageID);
  if (msg.includes("kiss")) return api.sendMessage(pick(replies.kiss), event.threadID, event.messageID);
  if (msg.includes("bye")) return api.sendMessage(pick(replies.bye), event.threadID, event.messageID);
  if (msg.includes("good night") || msg.includes("gn")) return api.sendMessage(pick(replies.goodnight), event.threadID, event.messageID);
  if (msg.includes("good morning") || msg.includes("gm")) return api.sendMessage(pick(replies.goodmorning), event.threadID, event.messageID);
  if (msg.includes("smile")) return api.sendMessage(pick(replies.smile), event.threadID, event.messageID);
  if (msg.includes("cute")) return api.sendMessage(pick(replies.cute), event.threadID, event.messageID);
  if (msg.includes("romantic")) return api.sendMessage(pick(replies.romantic), event.threadID, event.messageID);
  if (msg.includes("somrat")) return api.sendMessage(pick(replies.somrat), event.threadID, event.messageID);
};

module.exports.run = async function () {};
