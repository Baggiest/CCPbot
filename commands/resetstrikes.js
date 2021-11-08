module.exports = {
    name: 'resetoffenses',
    description: 'resets offenses',
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
                $set: {offenses: 0}
            }
        )
        message.reply("Offenses set to 0")
    }
}