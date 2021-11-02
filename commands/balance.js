module.exports = {
    name: 'balance',
    description: 'prints your social balance',
    cooldown: 5,
    async execute(message, args,) {
      const users = await message.client.dbInstance.collection('users').findOne({ uuid: message.author.id });  
      const m = await message.channel.send(users.balance.toString())
    }

};