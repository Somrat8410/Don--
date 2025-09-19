📄 | Source code of "bby.js":

const axios = require('axios');

const baseApiUrl = async () => {

    return "https://noobs-api.top/dipto";

};


module.exports.config = {

    name: "bby",

    aliases: ["baby", "bbe", "babe", "sam", "bot", "chat"],

    version: "6.9.0",

    author: "dipto | nexo_here",

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
