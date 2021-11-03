module.exports = {
    name: 'bal',
    description: 'gets social credit balance',
    cooldown: 5,
    async execute(message, args) {
        const user = await message.client.dbInstance.collection('users').findOne({ uuid: message.author.id });
        message.reply(user.balance.toString());
    },
};