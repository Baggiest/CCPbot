const Discord = require('discord.js');
const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_BANS, Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, Discord.Intents.FLAGS.GUILD_INTEGRATIONS, Discord.Intents.FLAGS.GUILD_WEBHOOKS, Discord.Intents.FLAGS.GUILD_PRESENCES, Discord.Intents.FLAGS.GUILD_MEMBERS, Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Discord.Intents.FLAGS.DIRECT_MESSAGES, Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS] });
const config = require('./config.json');
const swearjar = require('swearjar');
const fs = require('fs');
var startTime = performance.now();
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();
const MongoClient = require('mongodb').MongoClient;
const offenses = require('./commands/offenses');
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
client.prefix = config.prefix;
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}
async function logData(message){
    const user = await client.dbInstance.collection("users").findOne({ uuid: message.author.id})
    if (user == null){
        const china = { uuid: message.author.id, balance: 1000, offenses: 0}
        client.dbInstance.collection("users").insertOne(china);
        console.log("entry made to ",message.author.id)
        }
    else{
    }
}
async function exeCommand(command, message, args) {
    await command.execute(message, args);
}    
async function databaseConnect(){
    databaseClient = await new MongoClient(config.databaseURL, { useNewUrlParser: true, useUnifiedTopology: true });
    await databaseClient.connect(err => {
        if(err) return console.log(err)
        client.dbInstance = databaseClient.db(config.databaseName);
        client.login(config.token)
}); 
}
databaseConnect()
client.once('ready', async () => {
    var endTime = performance.now();
    var totalTime=endTime-startTime;
    console.log("bot took "+totalTime +"ms to load")
});
let replies = {
    "kacper": "sugma" //autoreply system based on keywords
};
client.on("messageCreate", async message => {
    if (message.author.bot) {return}; //don't include bots
    logData(message)
    isBad(message)
    isGood(message)
    if (message.content in replies) {
        message.reply(replies[message.content]); //seperate client.on for let replies
        return;
    }
    
});

// kacper and kaylon, start modifying this 
async function isBad(message) {
    const userid = message.author.id
    let messageString= message.content.toLowerCase();
    if (swearjar.profane(messageString) && (messageString.includes("china")||messageString.includes("ccp")||messageString.includes("trash")||messageString.includes("bad"))) {
        let user = await message.client.dbInstance.collection('users').findOne({uuid:userid});
        let usrOffenses = user.offenses+1; // adds one to include new strike in deduction
        const deduct = -Math.abs(10*(usrOffenses > 5 ? 5 : usrOffenses)); // multipler caps at 5 strikes
        await message.client.dbInstance.collection('users').updateOne(
            { uuid: userid },
            {
                $inc: {balance: deduct, offenses: 1}
            }
        )
        console.log(user.balance)
        console.log(`deducted 10 from ${userid}`)
        message.channel.send(`${deduct} social credit <@!${userid}> | Strikes: ${usrOffenses}`)
        try{
            message.delete()
        }
        catch{
            return
        }
    }
} 

async function isGood(message) {
	let messageString = message.content.toLowerCase();
	if (
		messageString.includes("good") || messageString.includes("awesome") || messageString.includes("cool") || messageString.includes("love") && (messageString.includes("china") || messageString.includes("ccp"))
	) {
		//score the bitch
		const userid = message.author.id;
        let user = await message.client.dbInstance.collection('users').findOne({uuid:userid});
        const uOffneses = user.offenses
        // super fucking scuff code, dont touch unless you know how to make it better | this is real youre just dumb bag
		userU = await message.client.dbInstance.collection("users").updateOne(
			{ uuid: userid },
			{
				$inc: {balance: 10 }
            }
		);
        const takeaway = user.offenses*0
        userU = await message.client.dbInstance.collection("users").updateOne(
            
			{ uuid: userid },
			{
				$inc: {offenses: user.offenses > 0 ? -1 : 0} // prevents offenses from going negative
               
            }
		);

		console.log(`added 10 to ${userid}`);
		message.channel.send(`+10 social credit <@!${userid}>`);
		try {
			message.delete;
		} catch {
			return;
		}
	} else {
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


});