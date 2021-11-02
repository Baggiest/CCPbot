module.exports = {
    name: 'add',
    description: 'prints your social balance',
    cooldown: 5,
    async execute(message, args,) {
        if(message.author.id !== "266275283177308161") return;
        const amount = parseInt(args[0])
      const users = await message.client.dbInstance.collection('users').updateOne({ uuid: message.author.id },  {$inc: { "balance" : amount } });  
      
     const m = await message.channel.send("command executed")
      
    }

}