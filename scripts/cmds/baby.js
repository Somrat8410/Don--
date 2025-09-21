const axios = require('axios');
const baseApiUrl = async () => {
    return "https://noobs-api.top/dipto";
};

module.exports.config = {
    name: "bby",
    aliases: ["baby", "bbe", "babe", "sam", "bot", "chat", " makima"],
    version: "6.9.0",
    author: "dipto | sazzad_here",
    countDown: 0,
    role: 0,
    description: "better than all sim simi",
    category: "chat",
    guide: {
        en: "{pn} [anyMessage] OR\nteach [YourMessage] - [Reply1], [Reply2], [Reply3]... OR\nteach [react] [YourMessage] - [react1], [react2], [react3]... OR\nremove [YourMessage] OR\nrm [YourMessage] - [indexNumber] OR\nmsg [YourMessage] OR\nlist OR \nall OR\nedit [YourMessage] - [NewMessage]"
    }
};

module.exports.onStart = async ({ api, event, args, usersData }) => {
    const link = `${await baseApiUrl()}/baby`;
    const dipto = args.join(" ").toLowerCase();
    const uid = event.senderID;
    let command, comd, final;

    try {
        if (!args[0]) {
            const ran = ["Bolo baby", "hum", "type help baby", "type !baby hi"];
            return api.sendMessage(ran[Math.floor(Math.random() * ran.length)], event.threadID, event.messageID);
        }

        if (args[0] === 'remove') {
            const fina = dipto.replace("remove ", "");
            const dat = (await axios.get(`${link}?remove=${encodeURIComponent(fina)}&senderID=${uid}`)).data.message;
            return api.sendMessage(dat, event.threadID, event.messageID);
        }

        if (args[0] === 'rm' && dipto.includes('-')) {
            const [fi, f] = dipto.replace("rm ", "").split(/\s*-\s*/);
            const da = (await axios.get(`${link}?remove=${encodeURIComponent(fi)}&index=${f}`)).data.message;
            return api.sendMessage(da, event.threadID, event.messageID);
        }

        if (args[0] === 'list') {
            if (args[1] === 'all') {
                const data = (await axios.get(`${link}?list=all`)).data;
                const limit = parseInt(args[2]) || 100;
                const limited = data?.teacher?.teacherList?.slice(0, limit);
                const teachers = await Promise.all(limited.map(async (item) => {
                    const number = Object.keys(item)[0];
                    const value = item[number];
                    const name = await usersData.getName(number).catch(() => number) || "Not found";
                    return { name, value };
                }));
                teachers.sort((a, b) => b.value - a.value);
                const output = teachers.map((t, i) => `${i + 1}/ ${t.name}: ${t.value}`).join('\n');
                return api.sendMessage(`Total Teach = ${data.length}\n👑 | List of Teachers of baby\n${output}`, event.threadID, event.messageID);
            } else {
                const d = (await axios.get(`${link}?list=all`)).data;
                return api.sendMessage(`❇️ | Total Teach = ${d.length || "api off"}\n♻️ | Total Response = ${d.responseLength || "api off"}`, event.threadID, event.messageID);
            }
        }

        if (args[0] === 'msg') {
            const fuk = dipto.replace("msg ", "");
            const d = (await axios.get(`${link}?list=${encodeURIComponent(fuk)}`)).data.data;
            return api.sendMessage(`Message ${fuk} = ${d}`, event.threadID, event.messageID);
        }

        if (args[0] === 'edit') {
            const parts = dipto.split(/\s*-\s*/);
            if (parts.length < 2) return api.sendMessage('❌ | Invalid format! Use edit [YourMessage] - [NewReply]', event.threadID, event.messageID);
            const dA = (await axios.get(`${link}?edit=${encodeURIComponent(args[1])}&replace=${encodeURIComponent(parts[1])}&senderID=${uid}`)).data.message;
            return api.sendMessage(`changed ${dA}`, event.threadID, event.messageID);
        }

        if (args[0] === 'teach' && args[1] === 'react') {
            const parts = dipto.replace("teach react ", "").split(/\s*-\s*/);
            if (parts.length < 2) return api.sendMessage('❌ | Invalid format! Use: teach react message - ❤️, 😀', event.threadID, event.messageID);
            const msg = parts[0].trim();
            const reacts = parts[1].trim();
            const res = await axios.get(`${link}?teach=${encodeURIComponent(msg)}&react=${encodeURIComponent(reacts)}`);
            return api.sendMessage(`✅ Reacts added: ${res.data.message}`, event.threadID, event.messageID);
        }

        if (args[0] === 'teach' && args[1] === 'amar') {
            const parts = dipto.split(/\s*-\s*/);
            if (parts.length < 2) return api.sendMessage('❌ | Invalid format! Use: teach amar message - reply', event.threadID, event.messageID);
            const msg = parts[0].replace("teach amar ", "").trim();
            const reply = parts[1].trim();
            const res = await axios.get(`${link}?teach=${encodeURIComponent(msg)}&senderID=${uid}&reply=${encodeURIComponent(reply)}&key=intro`);
            return api.sendMessage(`✅ Intro reply added: ${res.data.message}`, event.threadID, event.messageID);
        }

        if (args[0] === 'teach' && args[1] !== 'amar' && args[1] !== 'react') {
            const parts = dipto.split(/\s*-\s*/);
            if (parts.length < 2) return api.sendMessage('❌ | Invalid format! Use: teach message - reply1, reply2', event.threadID, event.messageID);
            const msg = parts[0].replace("teach ", "").trim();
            const replies = parts[1].trim();
            const res = await axios.get(`${link}?teach=${encodeURIComponent(msg)}&reply=${encodeURIComponent(replies)}&senderID=${uid}&threadID=${event.threadID}`);
            const teacherName = (await usersData.get(res.data.teacher)).name || "Unknown";
            return api.sendMessage(`✅ Replies added: ${res.data.message}\n👤 Teacher: ${teacherName}\n📚 Total Teachs: ${res.data.teachs}`, event.threadID, event.messageID);
        }

        if (dipto.includes('amar name ki') || dipto.includes('amr nam ki') || dipto.includes('amar nam ki') || dipto.includes('amr name ki') || dipto.includes('whats my name')) {
            const data = (await axios.get(`${link}?text=${encodeURIComponent("amar name ki")}&senderID=${uid}&key=intro`)).data.reply;
            return api.sendMessage(data, event.threadID, event.messageID);
        }

        const d = (await axios.get(`${link}?text=${encodeURIComponent(dipto)}&senderID=${uid}`)).data.reply;
        api.sendMessage(d, event.threadID, (error, info) => {
            global.GoatBot.onReply.set(info.messageID, {
                commandName: this.config.name,
                type: "reply",
                messageID: info.messageID,
                author: event.senderID,
                d,
                apiUrl: link
            });
        }, event.messageID);

    } catch (e) {
        console.log(e);
        api.sendMessage("Check console for error", event.threadID, event.messageID);
    }
};

module.exports.onReply = async ({ api, event, Reply }) => {
    try {
        if (event.type == "message_reply") {
            const a = (await axios.get(`${await baseApiUrl()}/baby?text=${encodeURIComponent(event.body?.toLowerCase())}&senderID=${event.senderID}`)).data.reply;
            await api.sendMessage(a, event.threadID, (error, info) => {
                global.GoatBot.onReply.set(info.messageID, {
                    commandName: this.config.name,
                    type: "reply",
                    messageID: info.messageID,
                    author: event.senderID,
                    a
                });
            }, event.messageID);
        }
    } catch (err) {
        return api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
    }
};

module.exports.onChat = async ({ api, event, message }) => {
    try {
        const body = event.body ? event.body.toLowerCase() : "";
        if (body.startsWith("baby") || body.startsWith("bby") || body.startsWith("bot") || body.startsWith("jan") || body.startsWith("babu") || body.startsWith("janu")) {
            const arr = body.replace(/^\S+\s*/, "");
            const randomReplies = ["ʙᴏʟ 🐸", "ʙᴏʟ sᴜɴᴛᴇᴄʜɪ 🐍", "ᴅᴀᴋɪs ᴋᴇɴ 😾?", "ʙᴏʟᴏ ᴊᴀᴀɴ ᴋɪ ᴋᴏʀᴛᴇ ᴘᴀʀɪ ᴛᴏᴍᴀʀ ᴊᴏɴɴᴏ 😞", "এতো ডাকছিস কেন? গালি শুনবি নাকি😾?", "বট বলে অসম্মান করছিস 😭?", "ʙᴏᴋᴀᴄᴏᴅᴀ ᴋɪ ʜᴏɪᴄʜᴇ ʙᴏʟ 😡?", "আমাকে না ডেকে, বস সাজ্জাদ কে একটা ɢᴏғғᴇɴ দে 😞🫶?", "ভালোবাসা নামক আব্লামি করতে চাইলে বস সাজ্জাদ এর ইনবক্সে যা😾?", "sᴀʟᴀᴍ ᴅᴇ ʙᴇᴛᴀ 👍", "ʜᴜʙʙʏ ডাকতে লজ্জা লাগে? 🧸", "আমাকে ডেকো না 🌚", "ᴛᴏᴍᴀʀ ɴᴀɴɪʀ sᴀᴡᴡᴀ 🗿", "ᴘʀᴇᴍ ᴋᴏʀʙɪ? 🫢", "ব্ল্যাকমেইল করবি না 😿?", "ʙᴏᴛ না বলে ᴀʙʙᴜ ডাক 😾?", "ʙʙʏ 👀?", "উফ বুঝলাম না এতো ᴅᴀᴋᴏ কেন? 😫", "ᴡʜᴀᴛ's ᴜᴘ? ", "আমি আবাল দের সাথে কথা বলি না 🥱", "ᴜᴍᴍᴍᴀᴀᴀʜʜ sᴇxʏ ʙʙʏ!💋", "ᴘᴏʀᴛᴇ ʙᴏs 🫦", "ᴇɪ ᴊ sᴜɴᴅᴏʀɪ ᴋɪ ʜᴏɪᴄʜᴇ ʙᴏʟᴏ! 🙈", "ᴛᴏᴍᴀʀ ɴᴀɴɪ ᴋ ᴠᴀʟᴏʙᴀsʜɪ ! 🫢", " ʙᴏʟᴏ ʙᴏɴᴅᴜ ᴋɪ ᴋᴏʀᴛᴇ ᴘᴀʀɪ ᴛᴏᴍᴀʀ ᴊᴏɴɴᴏ? 🌷💨", "ʙʙʏ ᴇᴋᴛᴀ ᴋɪssʏ ᴅɪʙᴀ? 😅🙊", "ᴀᴍɪ ᴄʜᴏᴛᴛᴏ ʙʙʏ ʙᴏʟᴇ ᴀᴍᴀᴋᴇ ɢᴀʟɪ ᴅɪʟᴀ? 😞", "ᴛᴏᴍᴀᴋᴇ ᴘʀᴏᴘᴏsᴇ ᴋᴏʀʟᴇ ʀᴀɢ ᴋᴏʀʙᴀ 🤭?", "ᴛᴜᴍɪ ᴊᴏᴋʜɴ ᴀᴍᴀᴋᴇ ᴅᴀᴋᴏ ᴀᴍᴀʀ ᴋᴏʟɪᴢᴀ ᴋᴇᴘᴇ ᴜᴛʜᴇ -! 😚", " আইছে ʙᴏᴋᴀxᴏᴅᴀ🤕", "ᴇᴛᴛᴏ ʙʙʏ ʙʙʏ ᴅᴀᴋʟᴇ ᴘʀᴇᴍ ᴇ ᴘᴏʀᴇ ᴊᴀʙᴏ ᴛᴏ🫣", " ᴀᴡᴡᴡ- থুমি আসছো xᴀɴ", "ʙᴏʟᴏ এতোখন ᴛᴏᴍᴀʀ ᴏᴘᴇᴋᴋʜᴀʏ ছিলাম🥹", "ᴛᴜᴍɪ ᴀᴍᴀʀ ʟɪᴛᴛʟᴇ sᴛᴀʀ 🌟😏", "ᴛᴜᴍɪ ᴀᴍᴀʀ ᴍɪsᴄʜɪᴇᴠᴏᴜs ʙʙʏ 😼💫", "ᴛᴜᴍɪ ᴀᴍᴀʀ sᴍɪʟᴇ ᴇʀ ʀᴇᴀsᴏɴ 😍✨", "ᴛᴜᴍɪ ᴀᴍᴀʀ sᴇᴄʀᴇᴛ ʜᴀᴘᴘɪɴᴇss 😘💖 ", "ᴛᴜᴍɪ ᴀᴍᴀʀ ʜᴇᴀʀᴛ ᴇʀ ᴠɪᴘ ❤️😏 ", "ᴛᴜᴍɪ ᴀᴍᴀʀ ʟɪʟ ᴛʀᴏᴜʙʟᴇ ᴍᴀᴋᴇʀ 🐸😝", "ᴛᴜᴍɪ ᴀᴍᴀʀ ᴄʜᴏᴄᴏʟᴀᴛᴇ ᴇʀ sᴡᴇᴇᴛɴᴇss 🍫😻", "ᴛᴜᴍɪ ᴀᴍᴀʀ sᴜɴsʜɪɴᴇ ☀️🌸", "ᴛᴜᴍɪ ᴀᴍᴀʀ ᴄᴜᴅᴅʟᴇ ʙᴜᴅᴅʏ 😽🐥", "ᴛᴜᴍɪ ᴀᴍᴀʀ ᴊᴏʏ ᴇʀ ʀᴇᴀsᴏɴ 😇💫 ", "ᴛᴜᴍɪ ᴀᴍᴀʀ ʀᴀʀᴇ ɢᴇᴍ 💎😏", "ᴛᴜᴍɪ ᴀᴍᴀʀ ʟɪʟ ᴍᴀɢɪᴄ ✨😻", "ᴛᴜᴍɪ ᴀᴍᴀʀ sᴍɪʟᴇ ᴄʜᴀʀᴀ ᴅɪɴ ɪɴᴄᴏᴍᴘʟᴇᴛᴇ 😝💖", "ᴛᴜᴍɪ ᴀᴍᴀʀ ʟɪᴛᴛʟᴇ ɴᴀᴜɢʜᴛʏ ᴀɴɢᴇʟ 😼🔥", "ᴛᴜᴍɪ ᴀᴍᴀʀ ғᴏʀᴇᴠᴇʀ ʟᴏᴠᴇ ❤️💫", "ᴛᴜᴍɪ ᴀᴍᴀʀ ʜᴇᴀʀᴛ sᴛᴇᴀʟ ᴋᴏʀʟᴇ ʙʜᴀʟᴏ ʜᴏᴛᴏ 😏💖", "ᴛᴜᴍɪ ᴀᴍᴀʀ ʟɪʟ ᴛᴇᴀsᴇ 😘🫣", "ᴛᴜᴍɪ ᴀᴍᴀʀ ᴅɪɴ ʙʀɪɢʜᴛ ᴋᴏʀᴏ 🌞✨", "ᴛᴜᴍɪ ᴀᴍᴀʀ ʟɪʟ ᴄᴜᴛɪᴇ 😻💖", "ᴛᴜᴍɪ ᴀᴍᴀʀ ᴇᴠᴇʀʏᴛʜɪɴɢ 😏💫", "ᴛᴜᴍᴀʀᴇ ᴀᴍɪ ʀᴀɪᴛᴇ ʙʜᴀʟᴏʙᴀsɪ 🐸📌", "ᴀᴍᴀʀ ᴇxᴀᴍ ᴀᴍɪ ᴘᴏʀᴛᴀsɪ 🐢", "ᴍᴏʀᴇ ɢᴇsɪ ᴋᴀʀᴏɴ ᴛᴏᴍᴀᴋᴇ ᴄʜᴀʀᴀ ᴀᴍɪ ʙᴀᴄᴍᴜ ɴᴀ", "ɢғ ᴠʜᴇʙᴇ ᴇᴋᴛᴜ sʜᴀsʜᴏɴ ᴋᴏʀᴇ ᴊᴀᴏ!🐸", "ᴀɢᴇ ᴇᴋᴛᴜ ɢᴀɴ ʙᴏʟᴏ,☹ɴᴀʜᴏʟᴇ ᴋᴏᴛʜᴀ ʙᴏʟʙᴏ ɴᴀ_🥺", "ᴇɪ ᴇɪ ᴛᴏʀ ᴘʀɪᴋᴋʜᴀ ᴋᴏʙᴇ ? sᴜᴅʜᴜ bʙʏ bʙʏ ᴋᴏʀɪs", "ᴀᴍɪ ᴋᴀɴᴀ ɴᴀ sᴜɴᴄʜɪ ,ʙᴏʟᴏ ᴋɪ ʙᴏʟʙᴀ", "ᴀʀ ᴋᴏᴛᴏ ʙᴀʀ ᴅᴀᴋʙɪ , sᴜɴᴄʜɪ ᴛᴏ 🐢", "ᴀᴍɪ ᴏɴɴᴇʀ ᴊɪɴɪs ᴇʀ sᴀᴛʜᴇ ᴋᴏᴛʜᴀ ʙᴏʟɪ ɴᴀ ᴏᴋᴋᴇ__😏", "ᴀᴍɪ ᴛᴏᴍᴀʀ sᴇɴɪᴏʀ ᴀᴘᴜ😼sᴏᴍᴍᴀɴ ᴅᴇᴏ🙁", "ᴀᴊ ᴇᴋᴛᴀ ᴘʜᴏɴ ɴᴀɪ ʙᴏʟᴇʏ ʀᴇᴘʟᴀʏ ᴅɪᴛᴇ ᴘᴀʀʟᴀᴍ ɴᴀ_🙄", "ʙᴏʟᴏ ᴋɪ ʙᴏʟʙᴀ, sᴏʙᴀʀ sᴀᴍɴᴇ ʙᴏʟʙᴀ ɴᴀᴋɪ?🤭🤏", "ᴀʀ ᴀᴋʙᴀʀ ʙᴀʙʏ ʙᴏʟʟᴇ ᴅᴇɪᴋʜᴏ ᴛᴏᴍᴀʀ ᴇᴋᴅɪɴ ɴᴀᴋɪ ᴀᴍʀ 10 ᴅɪɴ😒", "ɪ'ᴍ ʜᴇʀᴇ ᴊᴜsᴛ ғᴏʀ ʏᴏᴜ, sᴏ ʟᴇᴛ's ᴄʜᴀᴛ! 🤖💬", "ᴇɪ ʙᴏʟᴏᴅ ᴋɪ ʙᴏʟʙɪ ʙᴏʟ 😾", "ʜᴇʏ, ᴄᴜᴛɪᴇ! ᴡʜᴀᴛ's ᴜᴘ ? 😊", "ᴛᴏʀᴇ ᴍᴀʀᴀʀ ᴘʀɪᴘᴀʀᴇsʜɴ ɴɪᴄʜɪ 😌", "ʙᴏʟᴏ ʙᴀʙᴜ, ᴛᴜᴍɪ ᴋɪ ᴀᴍᴀᴋᴇ ʙʜᴀʟᴏʙᴀsᴏ? 😘", "ʏᴏᴜ'ʀᴇ ʟᴏᴏᴋɪɴɢ ᴀʙsᴏʟᴜᴛᴇʟʏ ᴀᴅᴏʀᴀʙʟᴇ ᴛᴏᴅᴀʏ! 🥰", "ʏᴏᴜ'ʀᴇ ᴀs sᴡᴇᴇᴛ ᴀs ᴄʜᴏᴄᴏʟᴀᴛᴇ! 🍫", "✨ ᴛᴏʀ sᴀᴛʜᴇ ᴋᴏᴛʜᴀ ɴᴀɪ ᴋᴀʀᴏɴ ᴛᴜɪ ᴏɴᴋ ʟᴜᴄᴄʜᴀ 💔", "- ᴄʜᴏʟᴏ ᴄʜᴏʟᴇ ᴊᴀɪ ʙɪᴅᴇssʜᴇ", "ᴄʜᴜᴘ ᴄʜᴀᴘ ᴘʀᴏᴘᴏsᴇ ᴋᴏʀ ᴀᴍᴀʀᴇ🫢"];
            if (!arr) {
                await api.sendMessage(randomReplies[Math.floor(Math.random() * randomReplies.length)], event.threadID, (error, info) => {
                    if (!info) message.reply("info obj not found");
                    global.GoatBot.onReply.set(info.messageID, {
                        commandName: this.config.name,
                        type: "reply",
                        messageID: info.messageID,
                        author: event.senderID
                    });
                }, event.messageID);
                return;
            }
            const a = (await axios.get(`${await baseApiUrl()}/baby?text=${encodeURIComponent(arr)}&senderID=${event.senderID}`)).data.reply;
            await api.sendMessage(a, event.threadID, (error, info) => {
                global.GoatBot.onReply.set(info.messageID, {
                    commandName: this.config.name,
                    type: "reply",
                    messageID: info.messageID,
                    author: event.senderID,
                    a
                });
            }, event.messageID);
        }
    } catch (err) {
        return api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
    }
};
