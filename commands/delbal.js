module.exports = {
    name: 'delbal',
    description: 'gets social credit balance',
    cooldown: 5,
    async execute(message, args) {
        const amount = parseInt(args[0], 10)
        const user = await message.client.dbInstance.collection('users').updateOne(
            { uuid: message.author.id },
            {
                $inc: {balance: -amount}
            }
        )
        const userB = await message.client.dbInstance.collection('users').findOne({ uuid: message.author.id });
        message.reply(userB.balance.toString());
    }
}