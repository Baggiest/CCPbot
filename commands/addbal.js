module.exports = {
    name: 'addbal',
    description: 'gets social credit balance',
    cooldown: 5,
    async execute(message, args) {
        const user = await message.client.dbInstance.collection('users').updateOne(
            { uuid: message.author.id },
            {
                $inc: {balance: args}
            }
        )
        message.reply("Balance updated to"+user.balance.toString())
    }
}