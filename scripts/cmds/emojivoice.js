const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports.config = {
  name: "emojiVoice",
  version: "3.0",
  credits: "Somrat Edit",
  description: "সব ইমোজির জন্য ভিন্ন ভিন্ন ভয়েস রিপ্লাই",
  eventType: ["message"],
  commandCategory: "event"
};

// জনপ্রিয় ইমোজি লিস্ট + ভয়েস
const emojiVoices = {
  "😂": "https://www.myinstants.com/media/sounds/anime-wow-sound-effect.mp3",
  "🤣": "https://www.myinstants.com/media/sounds/vine-boom.mp3",
  "😍": "https://www.myinstants.com/media/sounds/tuturu.mp3",
  "😡": "https://www.myinstants.com/media/sounds/discord-notification.mp3",
  "😭": "https://www.myinstants.com/media/sounds/windows-error.mp3",
  "😱": "https://www.myinstants.com/media/sounds/fbi-open-up.mp3",
  "😎": "https://www.myinstants.com/media/sounds/mlg-airhorn.mp3",
  "🥳": "https://www.myinstants.com/media/sounds/party-horn.mp3",
  "😴": "https://www.myinstants.com/media/sounds/cartoon-snore.mp3",
  "🤔": "https://www.myinstants.com/media/sounds/question.mp3",
  "😇": "https://www.myinstants.com/media/sounds/angelic-choir.mp3",
  "🔥": "https://www.myinstants.com/media/sounds/fire.mp3",
  "❤️": "https://www.myinstants.com/media/sounds/heart-beat.mp3",
  "🤩": "https://www.myinstants.com/media/sounds/sparkle.mp3",
  "👻": "https://www.myinstants.com/media/sounds/ghost.mp3",
  "💀": "https://www.myinstants.com/media/sounds/minecraft-death.mp3",
  "🙈": "https://www.myinstants.com/media/sounds/monkey.mp3",
  "💯": "https://www.myinstants.com/media/sounds/yeah-boy.mp3",
  "✨": "https://www.myinstants.com/media/sounds/twinkle.mp3",
  "😏": "https://www.myinstants.com/media/sounds/hmmm.mp3"
};

// ডিফল্ট ভয়েস (যদি ইমোজি লিস্টে না থাকে)
const defaultVoice = "https://www.myinstants.com/media/sounds/notification.mp3";

module.exports.run = async function ({ api, event }) {
  try {
    if (!event.body) return;

    let selectedVoice = null;

    for (const [emoji, voiceURL] of Object.entries(emojiVoices)) {
      if (event.body.includes(emoji)) {
        selectedVoice = voiceURL;
        break;
      }
    }

    // যদি লিস্টে না থাকে, তাহলে ডিফল্ট ভয়েস
    if (!selectedVoice) selectedVoice = defaultVoice;

    const filePath = path.join(__dirname, "cache", `voice_${Date.now()}.mp3`);
    const response = await axios.get(selectedVoice, { responseType: "arraybuffer" });
    fs.writeFileSync(filePath, Buffer.from(response.data, "utf-8"));

    api.sendMessage(
      { body: "🎤 Emoji voice reply:", attachment: fs.createReadStream(filePath) },
      event.threadID,
      () => fs.unlinkSync(filePath),
      event.messageID
    );
  } catch (e) {
    console.error(e);
  }
};
