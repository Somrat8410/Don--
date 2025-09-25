Command executed successfully:
const axios = require("axios");


const chatHistories = {};

const autoReplyEnabled = {};


module.exports = {

config: {

name: "pori",

version: "1.1.0",

author: "Xrotick",

countDown: 2,

role: 0,

shortDescription: {

en: "Pori AI - Cute companion chatbot"

},

longDescription: {

en: "Pori AI: Fun and cheerful chatbot with a friendly personality"

},

category: "ai",

guide: {

en: "{pn} [on/off/message]"

}

},


onStart: async function ({ api, event, args }) {

const { threadID, messageID, senderID, messageReply, body } = event;

let userMessage = args.join(" ");


const API_URL = "https://gemini-api-protick.onrender.com/chat";


if (userMessage.toLowerCase() === "on") {

autoReplyEnabled[senderID] = true;

return api.sendMessage("Hi there! Auto-reply mode is now [ON]. Let's have a great conversation!", threadID, messageID);

}


if (userMessage.toLowerCase() === "off") {

autoReplyEnabled[senderID] = false;

chatHistories[senderID] = [];

return api.sendMessage("Auto-reply mode is now [OFF]. Talk to you later!", threadID, messageID);

}


if (!autoReplyEnabled[senderID] && !body.toLowerCase().startsWith("pori")) return;


if (!chatHistories[senderID]) {

chatHistories[senderID] = [];

}


const isReplyingToBot = messageReply && messageReply.senderID === api.getCurrentUserID();

if (isReplyingToBot) {

userMessage = messageReply.body + "\nUser: " + userMessage;

chatHistories[senderID].push(`User: ${userMessage}`);

} else {

chatHistories[senderID].push(`User: ${userMessage}`);

}


if (chatHistories[senderID].length > 5) {

chatHistories[senderID].shift();

}


const fullConversation = chatHistories[senderID].join("\n");


const prompt = `Tomar name pori. Tumi onk cute akta girlfriend tumi sobar sathey friendly abong asole gf er motoy tumi sob somoy banglish bolbe abong respect dibe. Tomake baniyeche protck tar Facebook id https://facebook.com/protick.mrc". 1–2 lines er besi replay dibe na . akhon conversation soro koro :\n\n${fullConversation}`;


api.setMessageReaction("⌛", messageID, () => {}, true);


try {

const res = await axios.get(`${API_URL}?message=${encodeURIComponent(prompt)}`);

const botReply = res.data.reply || "Hmm... I'm not sure how to reply to that!";


chatHistories[senderID].push(botReply);


api.sendMessage(botReply, threadID, messageID);

api.setMessageReaction("✅", messageID, () => {}, true);

} catch (err) {

console.log("Error:", err);

api.sendMessage("Oops! Something went wrong. Try again later.", threadID, messageID);

api.setMessageReaction("❌", messageID, () => {}, true);

}

},


onChat: async function ({ api, event }) {

const { senderID, body, messageReply } = event;


if (!autoReplyEnabled[senderID]) return;


const isReplyToBot = messageReply && messageReply.senderID === api.getCurrentUserID();

if (isReplyToBot) {

const args = body.split(" ");

this.onStart({ api, event, args });

}

}

};
