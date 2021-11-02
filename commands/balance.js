const { MessageActionRow } = require("discord.js");
const { Db } = require("mongodb");

module.exports = {
    name: 'balance',
    description: 'prints your social balance',
    cooldown: 5,
    isMod: true,
    async execute(message, args,client,) {
      const user = await message.client.dbInstance.collection('users').findOne({ id: message.author.id });
      user.balance;
      const m = await message.channel.send(user.balance.toString());
    }

};