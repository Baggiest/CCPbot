module.exports = {
    name: 'add',
    description: 'prints your social balance',
    cooldown: 5,
    async execute(message, args,) {
        if(message.author.id !== "266275283177308161") return;
        const amount = parseInt(args[0])
      const users = await message.client.dbInstance.collection('users').UpdateOne({ uuid: message.author.id },  {$inc: { balance : amount } });  
      console.log(users)
      const m = await message.reply('New balance'+ users.balance.toString())
      
    }

}