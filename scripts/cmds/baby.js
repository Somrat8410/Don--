const axios = require("axios");
const apiUrl = "https://nix-baby-apis.vercel.app";
const randRep = [
  "hmmm bby",
  "bolo baby",
  "hea bolo",
  "hmm"
];

const getRand = () => randRep[Math.floor(Math.random() * randRep.length)];

module.exports.config = {
  name: "bby",
  aliases: ["baby"],
  version: "0.0.1",
  author: "ArYAN",
  cooldowns: 0,
  role: 0,
  shortDescription: "AI chat bot with learning",
  longDescription: "Chat bot with random replies, teaching, removing, editing",
  category: "chat",
  guide: {
    en: `Chat: {pn} [msg]
Teach: {pn} teach [msg] - [reply1, reply2]
Teach react: {pn} teach react [msg] - [react1, react2]
Remove: {pn} remove [msg]
Remove specific reply: {pn} rm [msg] - [index]
List teachers: {pn} list all
View info: {pn} list
Edit reply: {pn} edit [msg] - [newReply]`
  }
};

async function handleReply(api, event, text) {
  try {
    const res = await axios.get(`${apiUrl}/baby?text=${encodeURIComponent(text)}&senderID=${event.senderID}&font=1`);
    const rep = res?.data?.reply;
    if (rep) {
      api.sendMessage(rep, event.threadID, (err, info) => {
        if (!err) {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: module.exports.config.name,
            type: "reply",
            messageID: info.messageID,
            author: event.senderID
          });
        }
      }, event.messageID);
    } else {
      api.sendMessage("❌ | No response found. Please teach me!", event.threadID, event.messageID);
    }
  } catch (e) {
    console.error(e);
    api.sendMessage("❌ | Failed to fetch reply.", event.threadID, event.messageID);
  }
}

module.exports.onStart = async ({ api, event, args, usersData }) => {
  if (!event.body) return;
  const txt = args.join(" ").trim();
  const uid = event.senderID;
  const userName = await usersData.getName(uid);

  try {
    if (!txt) {
      const message = {
        body: `${userName}, ${getRand()}`,
        mentions: [{
          tag: userName,
          id: uid
        }]
      };
      return api.sendMessage(message, event.threadID, event.messageID);
    }

    if (args[0] === "remove") {
      const key = txt.slice(7).trim();
      const res = await axios.get(`${apiUrl}/baby-remove?key=${encodeURIComponent(key)}`);
      return api.sendMessage(res.data.message || "Removed", event.threadID, event.messageID);
    }

    if (args[0] === "rm" && txt.includes("-")) {
      const [key, repOrIdx] = txt.slice(3).split(/\s*-\s*/);
      if (!key || repOrIdx === undefined) {
        return api.sendMessage("❌ | Use: rm [msg] - [reply/index]", event.threadID, event.messageID);
      }
      const param = !isNaN(parseInt(repOrIdx)) ? `index=${encodeURIComponent(repOrIdx)}` : `reply=${encodeURIComponent(repOrIdx)}`;
      const res = await axios.get(`${apiUrl}/baby-remove?key=${encodeURIComponent(key)}&${param}`);
      return api.sendMessage(res.data.message || "Removed", event.threadID, event.messageID);
    }

    if (args[0] === "list") {
      if (args[1] === "all") {
        const tRes = await axios.get(`${apiUrl}/teachers`);
        const teachers = tRes.data.teachers || {};
        const sorted = Object.keys(teachers).sort((a, b) => teachers[b] - teachers[a]);
        const list = await Promise.all(sorted.map(async id => {
          const name = await usersData.getName(id).catch(() => id);
          return `• ${name}: ${teachers[id]}`;
        }));
        return api.sendMessage(`👑 | Teachers:\n${list.join("\n")}`, event.threadID, event.messageID);
      } else {
        const infoRes = await axios.get(`${apiUrl}/baby-info`);
        return api.sendMessage(
          `❇️ | Total Teach = ${infoRes.data.totalKeys || "api off"}\n♻️ | Total Response = ${infoRes.data.totalReplies || "api off"}`,
          event.threadID,
          event.messageID
        );
      }
    }

    if (args[0] === "edit") {
      const parts = txt.split(/\s*-\s*/);
      if (parts.length < 2) {
        return api.sendMessage("❌ | Use: edit [msg] - [newReply]", event.threadID, event.messageID);
      }
      const oldMsg = parts[0].replace("edit ", "");
      const newMsg = parts[1];
      const res = await axios.get(`${apiUrl}/baby-edit?key=${encodeURIComponent(oldMsg)}&replace=${encodeURIComponent(newMsg)}&senderID=${uid}`);
      return api.sendMessage(res.data.message || "Edited", event.threadID, event.messageID);
    }

    if (args[0] === "teach" && args[1] === "react") {
      const [comd, cmd] = txt.split(/\s*-\s*/);
      const final = comd.replace("teach react ", "");
      if (!cmd) {
        return api.sendMessage("❌ | Invalid format!", event.threadID, event.messageID);
      }
      const res = await axios.get(`${apiUrl}/baby?teach=${encodeURIComponent(final)}&react=${encodeURIComponent(cmd)}`);
      return api.sendMessage(`✅ Replies added ${res.data.message}`, event.threadID, event.messageID);
    }

    if (args[0] === "teach") {
      const [comd, cmd] = txt.split(/\s*-\s*/);
      const final = comd.replace("teach ", "");
      if (!cmd) {
        return api.sendMessage("❌ | Invalid format!", event.threadID, event.messageID);
      }
      
      const res = await axios.get(`${apiUrl}/baby?teach=${encodeURIComponent(final)}&reply=${encodeURIComponent(cmd)}&senderID=${uid}`);
      const teacher = await usersData.getName(uid).catch(() => uid);

      if (res.data.message === "This reply has already been taught for this question." || res.data.addedReplies?.length === 0) {
        return api.sendMessage(`❌ | This reply has already been taught for this question.\nTeacher: ${teacher}\nReply: ${cmd}`, event.threadID, event.messageID);
      }
      
      const teachsRes = await axios.get(`${apiUrl}/teachers`);
      const teachCount = teachsRes.data.teachers[uid] || 0;
      
      const addedReplies = res.data.addedReplies?.join(", ") || cmd;
      return api.sendMessage(`✅ | Replies added "${addedReplies}" added to "${final}".\nTeacher: ${teacher}\nTeachs: ${teachCount}`, event.threadID, event.messageID);
    }

    handleReply(api, event, txt);
  } catch (e) {
    console.error(e);
    api.sendMessage("❌ | Something went wrong.", event.threadID, event.messageID);
  }
};

module.exports.onReply = async ({ api, event }) => {
  if (!event.messageReply?.body) return;
  handleReply(api, event, event.body.toLowerCase());
};

module.exports.onChat = async ({ api, event, usersData }) => {
  if (event.senderID === api.getCurrentUserID() || !event.body) return;
  const txt = event.body.toLowerCase();
  const match = txt.match(/^(baby|bby|bot|বেবি|জান|jan|বট|বেবী|বাবু|janu)\s*(.*)/);
  if (!match) return;

  const rest = match[2]?.trim();
  const uid = event.senderID;
  const userName = await usersData.getName(uid);

  if (!rest) {
    const message = {
      body: `${userName}, ${getRand()}`,
      mentions: [{
        tag: userName,
        id: uid
      }]
    };
    return api.sendMessage(message, event.threadID, (err, info) => {
      if (!err) {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: module.exports.config.name,
          type: "reply",
          messageID: info.messageID,
          author: event.senderID
        });
      }
    }, event.messageID);
  }

  handleReply(api, event, rest);
};
