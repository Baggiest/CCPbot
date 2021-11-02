const { MessageActionRow } = require("discord.js");

module.exports = {
    name: 'zhong',
    description: 'Xina!',
    cooldown: 5,
    async execute(message, args) {
        const m = await message.channel.send("zhong?");
        m.edit(`Xina! Latency is \`${m.createdTimestamp - message.createdTimestamp}ms\`. API Latency is \`${message.client.ws.ping}ms\``);
        message.channel.send("https://cdn.discordapp.com/attachments/902930216354189395/904810433129639956/yuPWpNo.png")
    },
};