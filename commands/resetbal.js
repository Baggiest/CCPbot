module.exports = {
    name: 'resetbal',
    description: 'gets social credit balance',
    cooldown: 5,
    async execute(message, args) {
        mentionedUser = message.mentions.users.first()
        let userObj
        if (mentionedUser != null){
            userObj = mentionedUser.id
        } else {
            userObj = message.author.id
        }
        const user = await message.client.dbInstance.collection('users').updateOne(
            { uuid: userObj },
            {
                $set: {balance: 1000}
            }
        )
        message.reply("Balance reset to 1000")
    }
}