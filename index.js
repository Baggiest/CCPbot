const Discord = require('discord.js');
const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_BANS, Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, Discord.Intents.FLAGS.GUILD_INTEGRATIONS, Discord.Intents.FLAGS.GUILD_WEBHOOKS, Discord.Intents.FLAGS.GUILD_PRESENCES, Discord.Intents.FLAGS.GUILD_MEMBERS, Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Discord.Intents.FLAGS.DIRECT_MESSAGES, Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS] });
const config = require('./config.json');

client.once('ready', async () => {
    console.log("bot started")
});

client.on('messageCreate', async message => {

    if (message.content == "!ping") {
        message.reply("Pong!")
    }

})

client.login(config.token);