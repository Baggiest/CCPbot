module.exports = {
    name: 'addbal',
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
            await message.client.dbInstance.collection('users').updateOne(
                { uuid: userid },
                {
                    $inc: {balance: amount}
                }
            )
            const userB = await message.client.dbInstance.collection('users').findOne({ uuid: userid });
            message.reply(`Balance incremented to: ${userB.balance} from ${userB_OLD.balance}`);
            {
    }
        }
    }

}