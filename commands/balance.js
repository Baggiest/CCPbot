module.exports = {
    name: 'balance',
    description: 'prints your social balance',
    cooldown: 5,
    async execute(message, args) {
        mentionedUser = message.mentions.users.first()
        let userObj
        if (mentionedUser != null){
            userObj = mentionedUser.id
        } else {
            userObj = message.author.id
        }
        const user = await message.client.dbInstance.collection('users').findOne({ uuid: userObj });
        message.reply(user.balance.toString());
    },
};