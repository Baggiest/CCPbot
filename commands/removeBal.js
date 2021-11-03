module.exports = {
    name: "punishment",
    description: "Removes balance",
    cooldown: 5,
    isMod: true,
    async execute(message, args) {
        const users = await message.client.dbInstance.collection('users').updateOne({ uuid: message.author.id }, {$inc: { balance: -5}}); 
        message.reply("Their balance has been deducted...");
    },
    
};