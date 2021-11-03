const { SystemChannelFlags } = require("discord.js")

module.exports = {
    name: 'addbal',
    description: 'gets social credit balance',
    cooldown: 5,
    async execute(message, args) {
        const mention = message.mentions?.users?.first();
        const amount = parseInt(mention ? args[1] : args[0]);
        const user = mention ? mention.id : message.author.id;
        const userU = await message.client.dbInstance.collection('users').updateOne(
            { uuid: user.id },
            {
                $inc: {balance: amount}
            }
        )
        const userB = await message.client.dbInstance.collection('users').findOne({ uuid: user.id });
        message.reply(user)
    }
}