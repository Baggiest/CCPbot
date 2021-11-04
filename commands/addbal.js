module.exports = {
<<<<<<< HEAD
    name: 'add',
    description: 'prints your social balance',
    cooldown: 5,
    async execute(message, args,) {
        if(message.author.id !== "266275283177308161") return;
        const amount = parseInt(args[0])
      const users = await message.client.dbInstance.collection('users').UpdateOne({ uuid: message.author.id },  {$inc: { balance : amount } });  
      console.log(users)
      const m = await message.reply('New balance'+ users.balance.toString())
      
=======
    name: 'delbal',
    description: 'gets social credit balance',
    cooldown: 5,
    async execute(message, args) {
        const mention = message.mentions?.users?.first();
        const amount = parseInt(mention ? args[1] : args[0]);
        if(isNaN(amount)){
            console.log("error parsing NaN");
        } else {
            const userid = mention ? mention.id : message.author.id;
            const userB_OLD = await message.client.dbInstance.collection('users').findOne({ uuid: userid });
            const userU = await message.client.dbInstance.collection('users').updateOne(
                { uuid: userid },
                {
                    $inc: {balance: amount}
                }
            )
            const userB = await message.client.dbInstance.collection('users').findOne({ uuid: userid });
            message.reply(`Balance depleted to: ${userB.balance} from ${userB_OLD.balance}`);
            {
    }
        }
>>>>>>> c45a04953c97a940f655f9a8609db25fa81b0475
    }

}