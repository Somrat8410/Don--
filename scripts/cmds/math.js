module.exports = {
 config: {
 name: "math",
 version: "3.0",
 author: "XNIL",
 countDown: 5,
 role: 0,
 description: "Solve math and win money!",
 category: "game",
 guide: {
 en: "{p}math\n{p}math top"
 }
 },

 onStart: async function ({ message, event, args, usersData }) {
 const senderID = event.senderID;

 // ======= ✅ Leaderboard: /math top =======
 if (args[0] === "top") {
 const allUsers = await usersData.getAll();

 const top = allUsers
 .filter(u => typeof u.data?.mathWin === "number" && u.data.mathWin > 0)
 .sort((a, b) => b.data.mathWin - a.data.mathWin)
 .slice(0, 10);

 if (top.length === 0) {
 return message.reply("❌ No math winners yet.");
 }

 const leaderboard = top.map((user, i) => {
 const name = user.name || `User ${user.userID?.slice(-4) || "??"}`;
 return `${i + 1}. ${name} – ✅ ${user.data.mathWin} correct`;
 }).join("\n");

 return message.reply(`🏆 Top Math Solvers:\n\n${leaderboard}`);
 }

 // ======= ✅ Random Math Question =======
 const operators = ["+", "-", "*", "/"];
 const operator = operators[Math.floor(Math.random() * operators.length)];

 let num1 = Math.floor(Math.random() * 100) + 1;
 let num2 = Math.floor(Math.random() * 100) + 1;

 if (operator === "/") {
 num1 = num1 * num2;
 }

 const question = `${num1} ${operator} ${num2}`;
 let answer;

 if (operator === "/") {
 answer = (num1 / num2).toFixed(2);
 } else {
 answer = eval(question).toString();
 }

 const msg = await message.reply(
 `🧠 Solve this to win 💸 1000$:\n${question} = ?\n⏳ You have 60 seconds!`
 );

 global.GoatBot.onReply.set(msg.messageID, {
 commandName: this.config.name,
 author: senderID,
 correctAnswer: answer,
 timeout: setTimeout(() => {
 message.reply(`❌ Time's up! The correct answer was: ${answer}`);
 global.GoatBot.onReply.delete(msg.messageID);
 }, 60000),
 reward: 1000
 });
 },

 onReply: async function ({ message, event, Reply, usersData }) {
 if (event.senderID !== Reply.author) return;

 const userInput = event.body?.toString().trim();
 const correct = parseFloat(Reply.correctAnswer);
 const userAns = parseFloat(userInput);

 if (userAns === correct) {
 clearTimeout(Reply.timeout);
 global.GoatBot.onReply.delete(event.messageReply?.messageID || event.messageID);

 const userData = await usersData.get(event.senderID);
 userData.money = (userData.money || 0) + Reply.reward;
 userData.data = userData.data || {};
 userData.data.mathWin = (userData.data.mathWin || 0) + 1;

 await usersData.set(event.senderID, userData);

 return message.reply(`✅ Correct! You've earned 💸 ${Reply.reward}$`);
 } else {
 return message.reply("❌ Incorrect! Try again.");
 }
 }
};
