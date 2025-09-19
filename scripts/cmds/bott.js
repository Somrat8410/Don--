const a = require("axios");
const b = "https://nix-baby-apis.vercel.app";
const amiTomakeValobashi = ["ᴀᴍᴀʀ ꜱᴏɴᴀʀ ʙᴀɴɢʟᴀ ,ᴛᴀʀᴘᴏʀᴇ ʟᴀɪɴ ᴋɪ ?", "ᴇᴍʙɪ ᴋɪɴᴇ ᴅᴇᴏ ɴᴀ🥺", "ᴇᴋᴛᴀ ɢғ ᴋʜᴜɴᴊᴇ ᴅᴇᴏ ꜱᴏᴍʀᴀᴛ ᴋ🥺🥺", "ᴠᴀʟᴏ ᴋɪ ʜᴏɪʙᴀ ɴᴀ?", "ʙᴏʟᴇɴ ᴍʏᴀᴅᴀᴍ😌", "ʙʜᴜʟᴇ ᴊᴀᴏ ᴀᴍᴀᴋᴇ😞😞", "ᴀᴍɪ ʜᴏɪᴛᴏ ᴄᴀʟᴇɴᴅᴇʀ ɴᴏɪ, ʙᴜᴛ ᴛᴜᴍɪ ᴀᴍᴀʀ ᴇᴠᴇʀʏ ᴅᴀʏ😘", "kiss me jan😘🌷", "Bolo jaan ki korte panmr jonno"];
const d = () => amiTomakeValobashi[Math.floor(Math.random() * amiTomakeValobashi.length)];

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
Remove: {pn} remove [msg]
Remove specific reply: {pn} rm [msg] - [index]
List teachers: {pn} list all
View info: {pn} list
Edit reply: {pn} edit [msg] - [oldReply] - [newReply]`
    }
};

async function h(api, event, text) {
    try {
        const i = await a.get(`${b}/baby?text=${encodeURIComponent(text)}&senderID=${event.senderID}&font=1`);
        const { reply, reaction } = i?.data;

        if (reply) {
            const messageWithReaction = reply;
            api.sendMessage(messageWithReaction, event.threadID, (err, info) => {
                if (!err) {
                    if (reaction) {
                        api.setMessageReaction(reaction, info.messageID, () => {}, true);
                    }
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
    } catch (k) {
        console.error(k);
        api.sendMessage("❌ | Failed to fetch reply.", event.threadID, event.messageID);
    }
}

module.exports.onStart = async ({ api, event, args, usersData }) => {
    if (!event.body) return;
    const l = args.join(" ").trim();
    const m = event.senderID;
    try {
        if (!l) {
            return api.sendMessage(d(), event.threadID, event.messageID);
        }

        if (args[0] === "remove") {
            const n = l.slice(7).trim();
            const o = await a.get(`${b}/baby-remove?key=${encodeURIComponent(n)}`);
            return api.sendMessage(o.data.message || "Removed", event.threadID, event.messageID);
        }

        if (args[0] === "rm" && l.includes("-")) {
            const [n, p] = l.slice(3).split(/\s*-\s*/);
            if (!n || p === undefined) {
                return api.sendMessage("❌ | Use: rm [msg] - [reply/index]", event.threadID, event.messageID);
            }
            const q = !isNaN(parseInt(p)) ? `index=${encodeURIComponent(p)}` : `reply=${encodeURIComponent(p)}`;
            const o = await a.get(`${b}/baby-remove?key=${encodeURIComponent(n)}&${q}`);
            return api.sendMessage(o.data.message || "Removed", event.threadID, event.messageID);
        }

        if (args[0] === "list") {
            if (args[1] === "all") {
                const r = await a.get(`${b}/teachers`);
                const s = r.data.teachers || {};
                const t = Object.keys(s).sort((u, v) => s[v] - s[u]);
                const u = await Promise.all(t.map(async v => {
                    const w = await usersData.getName(v).catch(() => v);
                    return `• ${w}: ${s[v]}`;
                }));
                return api.sendMessage(`👑 | Teachers:\n${u.join("\n")}`, event.threadID, event.messageID);
            } else {
                const x = await a.get(`${b}/baby-info`);
                return api.sendMessage(
                    `❇️ | Total Teach = ${x.data.totalKeys || "api off"}\n♻️ | Total Response = ${x.data.totalReplies || "api off"}`,
                    event.threadID,
                    event.messageID
                );
            }
        }

        if (args[0] === "edit" && l.includes("-")) {
            const parts = l.split(/\s*-\s*/);
            if (parts.length < 3) {
                return api.sendMessage("❌ | Use: edit [msg] - [oldReply] - [newReply]", event.threadID, event.messageID);
            }
            const key = parts[0].replace("edit ", "");
            const oldReply = parts[1];
            const newReply = parts[2];
            
            const o = await a.get(`${b}/baby-edit?key=${encodeURIComponent(key)}&oldReply=${encodeURIComponent(oldReply)}&newReply=${encodeURIComponent(newReply)}&senderID=${m}`);
            return api.sendMessage(o.data.message || "Edited", event.threadID, event.messageID);
        }

        if (args[0] === "teach" && args[1] === "react") {
