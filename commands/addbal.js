module.exports = {
    name: 'addbal',
    description: 'gets social credit balance',
    cooldown: 5,
    async execute(message, args) {
        const amount = parseInt(args[0], 10)
        const user = await message.client.dbInstance.collection('users').updateOne(
            { uuid: message.author.id },
            {
                $inc: {balance: amount}
            }
        )
        let userB = user.balance
        message.reply(`balance updated to ${userB.toString()}`)
    }
}