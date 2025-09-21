const axios = require("axios");
const { GoatWrapper } = require("fca-liane-utils");

module.exports.config = {
  name: "sakura",
  version: "2.0",
  role: 0,
  author: "Ew’r Saim",
  description: "Friendly AI Sakura from Wind Breaker",
  usePrefix: true,
  guide: "[message] | just type sakura",
  category: "ai",
  aliases: ["haruka", "windboy", "breaker"]
};

const API_BASE = "https://xsaim8x-xxx-api.onrender.com/api/sakura";
const randomOpeners = [
  "Bolo bondhu, ki help lagbe? 😎",
  "Hmm... kichu jiggesh korte chao naki? 🌸",
  "Kire mama ki obosta tor? 🫠",
  "Yes I'm here... ✨",
  "Ki re? Ki somossa tor? 😏"
];

module.exports.onStart = async function ({ api, args, event }) {
  const userId = event.senderID;
  const input = args.join(" ").trim();

  if (!input) {
    const opener = randomOpeners[Math.floor(Math.random() * randomOpeners.length)];
    return api.sendMessage(opener, event.threadID, (err, info) => {
      if (!err) {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: module.exports.config.name,
          type: "reply",
          messageID: info.messageID,
          author: userId
        });
      }
    }, event.messageID);
  }

  try {
    const res = await axios.get(API_BASE, { params: { query: input, userId } });
    const aiText = res.data.response || "Bujhte parlam na... abar bol? 😅";

    api.sendMessage(aiText, event.threadID, (err, info) => {
      if (!err) {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: module.exports.config.name,
          type: "reply",
          messageID: info.messageID,
          author: userId
        });
      }
    }, event.messageID);

  } catch (err) {
    const msg = err.response?.data?.error || err.message;
    api.sendMessage("❌ Sakura confused hoye gelo!\nError: " + msg, event.threadID, event.messageID);
  }
};

module.exports.onReply = async function ({ api, event, Reply }) {
  if (event.senderID !== Reply.author) return;

  const userId = event.senderID;
  const input = event.body.trim();

  try {
    const res = await axios.get(API_BASE, { params: { query: input, userId } });
    const aiText = res.data.response || "Bol bol... tor kotha shunle valo lage 😎";

    api.sendMessage(aiText, event.threadID, (err, info) => {
      if (!err) {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: module.exports.config.name,
          type: "reply",
          messageID: info.messageID,
          author: userId
        });
      }
    }, event.messageID);

  } catch (err) {
    const msg = err.response?.data?.error || err.message;
    api.sendMessage("❌ Error: " + msg, event.threadID, event.messageID);
  }
};

const wrapper = new GoatWrapper(module.exports);
wrapper.applyNoPrefix({ allowPrefix: true });
