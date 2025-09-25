Command executed successfully:
const axios = require("axios");


const chatHistories = {};

const autoReplyEnabled = {};


module.exports = {
  
  config: {
    
    name: "magi",
    
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
  
  
  onStart: async function({ api, event, args }) {
    
    const { threadID, messageID, senderID, messageReply, body } = event;
    
    let userMessage = args.join(" ");
    
    
    const API_URL = "https://gemini-api-protick.onrender.com/chat";
    
    
    if (userMessage.toLowerCase() === "on") {
      
      autoReplyEnabled[senderID] = true;
      
      return api.sendMessage("kire khankir pola ki hoise amre on korsos keno ami tore tor mar sate cudmu ak sate raikha ", threadID, messageID);
      
    }
    
    
    if (userMessage.toLowerCase() === "off") {
      
      autoReplyEnabled[senderID] = false;
      
      chatHistories[senderID] = [];
      
      return api.sendMessage("parbi na deikha off koira dili codanir pola", threadID, messageID);
      
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
    
    
    const prompt = `Tomar name supti. tumi akta galibuj + romantic gf. keu jodi tumake gali dei tahole tumi take joto baje gali ase sob dibe. tumi sob somoy banglay kotha bolbe. jodi tomake keu gali dei tahole joto baje bebohar ase ta tumi tar sate korba. Tomake baniyeche protck tar Facebook id https://facebook.com/protick.mrc". 1–2 lines er besi replay dibe na . akhon conversation soro koro :\n\n${fullConversation}`;
    
    
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
  
  
  onChat: async function({ api, event }) {
    
    const { senderID, body, messageReply } = event;
    
    
    if (!autoReplyEnabled[senderID]) return;
    
    
    const isReplyToBot = messageReply && messageReply.senderID === api.getCurrentUserID();
    
    if (isReplyToBot) {
      
      const args = body.split(" ");
      
      this.onStart({ api, event, args });
      
    }
    
  }
  
};
