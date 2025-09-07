const { GoatWrapper } = require('fca-liane-utils');

module.exports = {
  config: {
    name: "owner",
    aliases: ["info", "profile"],
    author: "Amit Max ⚡",
    role: 0,
    shortDescription: "Show owner's profile",
    longDescription: "Shows a short personal profile of the owner.",
    category: "profile",
    guide: "{pn}"
  },

  onStart: async function ({ api, event }) {
    const time = new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' });

    const profile = `
♡ ∩_∩
（„• ֊ •„)♡
╭─∪∪────────────⟡
│   𝙸𝙽𝙵𝙾
├───────────────⟡

│ Name: Somrat Ahmed 
│ Class: Inter 1st  
│ Group: Accounting  
│ Gender: Male  
│ DOB: 25-01-2006  
│ Religion: Sanatan  
│ Blood: AB+  
│ Height: 5.5 ft  
│ Location: Chuadanga, Alomdanga  
│ Hobby: Flirting  
│ Status: Single  
│ FB: https://www.facebook.com/somrat.3.2025
│ IG: instagram.com/somrat  
│ Email: Somrat8410@gamil.com 

⏰ Time: ${time}`;

    api.sendMessage(profile, event.threadID, (err, info) => {
      if (err) return console.error(err);
      setTimeout(() => {
        api.unsendMessage(info.messageID);
      }, 20000); // 20 seconds = 20000 ms
    });
  }
};

const wrapper = new GoatWrapper(module.exports);
wrapper.applyNoPrefix({ allowPrefix: true });
