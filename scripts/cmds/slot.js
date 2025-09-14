module.exports = {
  config: {
    name: "slots",
    aliases: ["slot", "spin"],
    version: "1.3",
    author: "xnil6x",
    countDown: 3,
    role: 0,
    description: "🎰 Ultra-stylish slot machine with balanced odds",
    category: "game",
    guide: {
      en: "Use: {pn} [bet amount]"
    }
  },

  onStart: async function ({ message, event, args, usersData }) {
    const { senderID } = event;
    const bet = parseInt(args[0]);

    // Enhanced money formatting with colors
    const formatMoney = (amount) => {
      if (isNaN(amount)) return "💲0";
      amount = Number(amount);
      const scales = [
        { value: 1e15, suffix: 'Q', color: '🌈' },  // Quadrillion
        { value: 1e12, suffix: 'T', color: '✨' },  // Trillion
        { value: 1e9, suffix: 'B', color: '💎' },  // Billion
        { value: 1e6, suffix: 'M', color: '💰' },   // Million
        { value: 1e3, suffix: 'k', color: '💵' }    // Thousand
      ];
      const scale = scales.find(s => amount >= s.value);
      if (scale) {
        const scaledValue = amount / scale.value;
        return `${scale.color}${scaledValue.toFixed(2)}${scale.suffix}`;
      }
      return `💲${amount.toLocaleString()}`;
    };

    if (isNaN(bet) || bet <= 0) {
      return message.reply("🔴 𝗘𝗥𝗥𝗢𝗥: Please enter a valid bet amount!");
    }

    const user = await usersData.get(senderID);
    if (user.money < bet) {
      return message.reply(`🔴 𝗜𝗡𝗦𝗨𝗙𝗙𝗜𝗖𝗜𝗘𝗡𝗧 𝗙𝗨𝗡𝗗𝗦: You need ${formatMoney(bet - user.money)} more to play!`);
    }

    // Premium symbols with different weights
    const symbols = [
      { emoji: "🍒", weight: 30 },
      { emoji: "🍋", weight: 25 },
      { emoji: "🍇", weight: 20 },
      { emoji: "🍉", weight: 15 },
      { emoji: "⭐", weight: 7 },
      { emoji: "7️⃣", weight: 3 }
    ];

    // Weighted random selection
    const roll = () => {
      const totalWeight = symbols.reduce((sum, symbol) => sum + symbol.weight, 0);
      let random = Math.random() * totalWeight;
      for (const symbol of symbols) {
        if (random < symbol.weight) return symbol.emoji;
        random -= symbol.weight;
      }
      return symbols[0].emoji;
    };

    const slot1 = roll();
    const slot2 = roll();
    const slot3 = roll();

    // 50% chance to win with various multipliers
    let winnings = 0;
    let outcome;
    let winType = "";
    let bonus = "";

    if (slot1 === "7️⃣" && slot2 === "7️⃣" && slot3 === "7️⃣") {
      winnings = bet * 10;
      outcome = "🔥 𝗠𝗘𝗚𝗔 𝗝𝗔𝗖𝗞𝗣𝗢𝗧! 𝗧𝗥𝗜𝗣𝗟𝗘 7️⃣!";
      winType = "💎 𝗠𝗔𝗫 𝗪𝗜𝗡";
      bonus = "🎆 𝗕𝗢𝗡𝗨𝗦: +3% to your total balance!";
      await usersData.set(senderID, { money: user.money * 1.03 });
    } 
    else if (slot1 === slot2 && slot2 === slot3) {
      winnings = bet * 5;
      outcome = "💰 𝗝𝗔𝗖𝗞𝗣𝗢𝗧! 3 matching symbols!";
      winType = "💫 𝗕𝗜𝗚 𝗪𝗜𝗡";
    } 
    else if (slot1 === slot2 || slot2 === slot3 || slot1 === slot3) {
      winnings = bet * 2;
      outcome = "✨ 𝗡𝗜𝗖𝗘! 2 matching symbols!";
      winType = "🌟 𝗪𝗜𝗡";
    } 
    else if (Math.random() < 0.5) { // 50% base chance to win something
      winnings = bet * 1.5;
      outcome = "🎯 𝗟𝗨𝗖𝗞𝗬 𝗦𝗣𝗜𝗡! Bonus win!";
      winType = "🍀 𝗦𝗠𝗔𝗟𝗟 𝗪𝗜𝗡";
    } 
    else {
      winnings = -bet;
      outcome = "💸 𝗕𝗘𝗧𝗧𝗘𝗥 𝗟𝗨𝗖𝗞 𝗡𝗘𝗫𝗧 𝗧𝗜𝗠𝗘!";
      winType = "☠️ 𝗟𝗢𝗦𝗦";
    }

    await usersData.set(senderID, { money: user.money + winnings });
    const finalBalance = user.money + winnings;

    // Fancy ASCII art for slots
    const slotBox = 
      "╔═════════════════════╗\n" +
      "║  🎰 𝗦𝗟𝗢𝗧 𝗠𝗔𝗖𝗛𝗜𝗡𝗘 🎰  ║\n" +
      "╠═════════════════════╣\n" +
      `║     [ ${slot1} | ${slot2} | ${slot3} ]     ║\n` +
      "╚═════════════════════╝";

    // Color-coded result message
    const resultColor = winnings >= 0 ? "🟢" : "🔴";
    const resultText = winnings >= 0 ? `🏆 𝗪𝗢𝗡: ${formatMoney(winnings)}` : `💸 𝗟𝗢𝗦𝗧: ${formatMoney(bet)}`;

    const messageContent = 
      `${slotBox}\n\n` +
      `🎯 𝗥𝗘𝗦𝗨𝗟𝗧: ${outcome}\n` +
      `${winType ? `${winType}\n` : ""}` +
      `${bonus ? `${bonus}\n` : ""}` +
      `\n${resultColor} ${resultText}` +
      `\n💰 𝗕𝗔𝗟𝗔𝗡𝗖𝗘: ${formatMoney(finalBalance)}` +
      `\n\n💡 𝗧𝗜𝗣: Higher bets increase jackpot chances!`;

    return message.reply(messageContent);
  }
};
