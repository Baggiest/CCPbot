const { SystemChannelFlags } = require("discord.js")

module.exports = {
    name: 'addbal',
    description: 'gets social credit balance',
    cooldown: 5,
    async execute(message, args) {
        mentionedUser = message.mentions.users.first()
        let userObj
        if (mentionedUser != null){
            userObj = mentionedUser.id
            const amount = parseInt(args[1], 10)
        } else {
            const amount = parseInt(args[0], 10)
            userObj = message.author.id
        }
        console.log("Debugging.")
        console.log(userObj)
        console.log(args[0])
        const amount = parseInt(args[0], 10)
        const user = await message.client.dbInstance.collection('users').updateOne(
            { uuid: userObj },
            {
                $inc: {balance: amount}
            }
        )
        const userB = await message.client.dbInstance.collection('users').findOne({ uuid: userObj });
        message.reply(userB.balance.toString());
        
    }
}