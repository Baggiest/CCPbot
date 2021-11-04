const Discord = require('discord.js');
const swearjar = require('swearjar');

const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_BANS, Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, Discord.Intents.FLAGS.GUILD_INTEGRATIONS, Discord.Intents.FLAGS.GUILD_WEBHOOKS, Discord.Intents.FLAGS.GUILD_PRESENCES, Discord.Intents.FLAGS.GUILD_MEMBERS, Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Discord.Intents.FLAGS.DIRECT_MESSAGES, Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS] });
const config = require('./config.json');
const fs = require('fs');
var startTime = performance.now();

client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();
const MongoClient = require('mongodb').MongoClient;
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
client.prefix = config.prefix;
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}
async function logData(message){
    const user = await client.dbInstance.collection("users").findOne({ uuid: message.author.id})
    if (user == null){
        const china = { uuid: message.author.id, balance: 1000}
        client.dbInstance.collection("users").insertOne(china);
        console.log("entry made to ", message.author.id)
    }
    else {

    }
}
async function exeCommand(command, message, args) {
    await command.execute(message, args);
}
async function databaseConnect() {
    databaseClient = await new MongoClient(config.databaseURL, { useNewUrlParser: true, useUnifiedTopology: true });
    await databaseClient.connect(err => {
        if (err) return console.log(err)
        client.dbInstance = databaseClient.db(config.databaseName);
        client.login(config.token)
    });
}


databaseConnect()
client.once('ready', async () => {
    var endTime = performance.now();
    var totalTime = endTime - startTime;
    console.log("bot took " + totalTime + "ms to load")
});



let replies = { //autoreply system based on keywords
};
client.on("messageCreate", async message => {
    logData(message)
    isBad(message)
    if (message.content in replies) {
        message.reply(replies[message.content]); //seperate client.on for let replies
        return;
    }
})


// kacper and kaylon, start modifying this 
async function isBad(message) {
    let messageString= message.content.toLowerCase();
    if (swearjar.profane(messageString) && (messageString.includes("china")|| messageString.includes("ccp"))) {
        //score the bitch
        console.log(messageString)
        console.log("gulag")
        message.reply("https://cdn.discordapp.com/attachments/700456503542546562/905842794399158292/unknown.png")
    }else{
        console.log(messageString)
        console.log("we good")
    }
}


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