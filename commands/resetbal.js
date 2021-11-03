module.exports = {
    name: 'resetbal',
    description: 'gets social credit balance',
    cooldown: 5,
    async execute(message, args) {
        const user = await message.client.dbInstance.collection('users').updateOne(
            { uuid: message.author.id },
            {
                $set: {balance: 1000}
            }
        )
        message.reply("Balance reset to"+user.balance)
    }
}