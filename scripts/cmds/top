const { GoatWrapper } = require("fca-liane-utils");

module.exports = {
  config: {
    name: "top",
    aliases: ["rich", "leaderboard", "coinstop"],
    version: "1.0",
    author: "Nisanxnx",
    countDown: 5,
    role: 0,
    shortDescription: "Top 10 richest users",
    longDescription: "Show top 10 users with highest coin balance",
    category: "economy",
    guide: "{p}top"
  },

  onStart: async function ({ message, usersData }) {
    const allUsers = await usersData.getAll();
    const sorted = allUsers
      .filter(u => u.money && u.money > 0)
      .sort((a, b) => b.money - a.money)
      .slice(0, 10);

    if (sorted.length === 0) return message.reply("📛 এখনো কোনো ইউজারের ব্যালেন্স নেই!");

    let msg = "🏆 টপ 10 ধনী ইউজার:\n\n";
    for (let i = 0; i < sorted.length; i++) {
      const user = sorted[i];
      msg += `${i + 1}. ${user.name || "Unknown"} - ${user.money} কয়েন\n`;
    }

    message.reply(msg);
  }
};
