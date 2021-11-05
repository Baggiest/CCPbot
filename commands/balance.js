module.exports = {
<<<<<<< HEAD
    name: 'balance',
    description: 'prints your social balance',
    cooldown: 5,
    async execute(message, args,) {
      const users = await message.client.dbInstance.collection('users').findOne({ uuid: message.author.id});  
      const m = await message.channel.send(users.balance.toString())
    }

=======
    name: 'bal',
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
        const user = await message.client.dbInstance.collection('users').findOne({ uuid: userObj });
        message.reply(user.balance.toString());
    },
>>>>>>> 2ce8cad18fbe670fa3db7c16f12e9de172f43cfe
};