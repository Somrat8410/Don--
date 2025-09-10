module.exports = {
  config: {
    name: "edit",
    aliases: ["e", "aiedit"],
    version: "1.6.9",
    author: "Nazrul",
    role: 0,
    description: "Edit. image by URL or reply",
    category: "ai",
    usePrefix: true,
    isPremium: false,
    countDown: 7,
    guide: { en: "{pn} [url] [prompt] or reply to image & prompt" }
  },

  onStart: async ({ message, event, args }) => {
    let imgUrl, prompt = "";

    if (event.messageReply?.attachments?.[0]?.type === "photo") {
      imgUrl = event.messageReply.attachments[0].url;
      prompt = args.join(" ");
    }

    if (!imgUrl && args[0]) {
      imgUrl = args[0];
      prompt = args.slice(1).join(" ");
    }

    if (!imgUrl) {
      return message.reply("• Reply to an image or provide image URL!\n• Add Prompt (for edit)");
    }

    message.reaction('⏳', event.messageID);
    const wm = await message.reply("⏳ Editing your image... Please wait!");

    try {
      const apiUrl = (await require('axios').get("https://raw.githubusercontent.com/nazrul4x/Noobs/main/Apis.json")).data.cdi;
 const res = await require('axios').get(`${apiUrl}/nazrul/edit?imgUrl=${encodeURIComponent(imgUrl)}&prompt=${encodeURIComponent(prompt)}&key=edit01`, { responseType: "stream" }
      );

      const contentType = res.headers['content-type'];
      message.reaction('✅', event.messageID);
      await message.unsend(wm.messageID);

      if (contentType.includes("image")) {
        return message.reply({
          body: `✅ Here's your Edited image!`,
          attachment: res.data
        });
      } else {
        let text = "";
        res.data.setEncoding("utf8");
        for await (const chunk of res.data) text += chunk;

        const json = JSON.parse(text);
        return message.reply(json?.result?.text || "• Not found any result!");
      }

    } catch (error) {
      message.reaction('❌', event.messageID);
      await message.unsend(wm.messageID);
      return message.reply(`❌ Error: ${error.message}`);
    }
  }
};
