const Discord = require('discord.js');

module.exports = {
    name: 'score',
    description: 'gets social credit balance',
    cooldown: 5,
    async execute(message, args) {


        const user = await message.client.dbInstance.collection('users').findOne({ uuid: message.author.id });
        const userB = 400//user.balance.toString();
        /* let theCunt= message.author.id;
        const role = interaction.options.getRole('gulag');
        const member = interaction.options.getMember(theCunt);
        */
        if (userB > 999) {
            message.reply(`your social score balance is ${userB}`);
            message.channel.send("https://cdn.discordapp.com/attachments/902930216354189395/905207057945329664/images.png")
        } else {
            message.reply(`your social score balance is ${userB} youre goin to the gulag`);
            //member.roles.add(role);
            message.channel.send("https://tenor.com/view/angry-chinese-man-with-gun-shoot-pew-pow-gun-chinese-man-anger-gif-18651737")
        }
    },
};