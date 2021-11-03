module.exports = {
    name: "reduce",
    description: "Reward balance to user",
    cooldown: 5,
    isMod: true,
    async execute(message, args) {
        const amount = -Math.abs(parseInt(args[1]));
        const punishedUser = message.mentions.users.first();
        await message.client.dbInstance.collection('users').updateOne({ uuid: punishedUser.id }, {$inc: { balance: amount}}); 
        message.reply(`${punishedUser}'s balance has been decreased by ${amount} points.;-;！`);
    },

};