const Discord = require('discord.js');
const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_BANS, Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, Discord.Intents.FLAGS.GUILD_INTEGRATIONS, Discord.Intents.FLAGS.GUILD_WEBHOOKS, Discord.Intents.FLAGS.GUILD_PRESENCES, Discord.Intents.FLAGS.GUILD_MEMBERS, Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Discord.Intents.FLAGS.DIRECT_MESSAGES, Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS] });
const config = require('./config.json');
const fs = require('fs');
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
client.prefix = config.prefix;
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

async function exeCommand(command, message, args) {
    await command.execute(message, args);
}

client.once('ready', async () => {
    console.log("bot started")
});

client.on('messageCreate', async message => {
    if (!(message.content.startsWith(client.prefix) || message.mentions.users.first() == client.user) || message.author.bot) return;
    if (message.content.startsWith(client.prefix)) {
        args = message.content.slice(client.prefix.length).split(/ +/);
    } else {
        args = message.content.slice(client.prefix.length).split(/ +/).slice(1);
    }
    let commandName;
    if (args) {
        commandName = args.shift().toLowerCase();
    }
    const command = await client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;
    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`)
                .then(msg => {
                    setTimeout(function () {
                        try {
                            msg.delete();
                        } catch (error) { }
                    }, 5000);
                });

        }
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }
    try {
        if (command.guildOnly && message.channel.type !== 'GUILD_TEXT') {
            return message.reply('I can\'t execute that command inside DMs or threads!');
        }
        if (command.args && !args.length) {
            const commandhelp = client.commands.get("help");
            const argshelp = [command.name];
            commandhelp.execute(message, argshelp)
        } else {
            if (command.needsmod) {
                let isMod = false;
                modRoles.forEach(element => {
                    if (currentMember.roles.cache.has(element) || currentMember.permissions.has(['ADMINISTRATOR'])) {
                        isMod = true;
                    }
                    if (isMod) return;
                });
                if (!isMod) {
                    return;
                } else {
                    exeCommand(command, message, args);
                }
            } else if (command.needsadmin) {
                if (currentMember.permissions.has(['ADMINISTRATOR']) || message.author.id == ownerID) {
                    exeCommand(command, message, args);
                    return;
                } else {
                }
            } else {
                exeCommand(command, message, args);
            }
        }
    } catch (error) {
        console.error(`Command perms check: ${error}`);
        message.reply('there was an error trying to execute that command!');
    }


})

client.login(config.token);