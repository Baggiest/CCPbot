const Discord = require('discord.js');
const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_BANS, Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, Discord.Intents.FLAGS.GUILD_INTEGRATIONS, Discord.Intents.FLAGS.GUILD_WEBHOOKS, Discord.Intents.FLAGS.GUILD_PRESENCES, Discord.Intents.FLAGS.GUILD_MEMBERS, Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Discord.Intents.FLAGS.DIRECT_MESSAGES, Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS] });
const config = require('./config.json');
const swearjar = require('swearjar');
const fs = require('fs');
//const algoFile = require(`./creditAlgo/algorithm.js`);
//console.log(`${algoFile} was imported.`); add these later on cuz idk how to pass message to different files
var startTime = performance.now();
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();
const MongoClient = require('mongodb').MongoClient;
const offenses = require('./commands/offenses');
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
//const algoFiles = fs.readdirSync('./creditAlgo').filter(file => file.endsWith('.js'));
const { badwords } = require("./files/badwords.json")
client.prefix = config.prefix;
for (const file of commandFiles){
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}
client.once('ready', async () => {
    var endTime = performance.now();
    var totalTime=endTime-startTime;
    console.log("bot took "+totalTime +"ms to load")
});
async function logData(message){
    const user = await client.dbInstance.collection("users").findOne({ uuid: message.author.id})
    if (user == null){
        const china = { uuid: message.author.id, balance: 1000, offenses: 0}
        client.dbInstance.collection("users").insertOne(china);
        console.log("entry made to ",message.author.name)
    }
    else{
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
let replies = { //autoreply system based on keywords
    "kacper": "sugma"
};
client.on('messageCreate', async message => {
    if (message.author.bot) return;
    //START OF ALGO
    if(!message.member.hasPermission("ADMINISTRATOR")){
        let confirm = false;
        //for loop
        var i;
        for(i = 0; i < badwords.length; i++){
            if(message.content.toLowerCase().includes(badwords[i].toLowerCase()))
            confirm = true;
        }

        if(confirm){
            //message.delete()
            let amount = 10
            const userid = message.author.id;
            const userU = await message.client.dbInstance.collection('users').updateOne(
                { uuid: userid },
                {
                    $inc: {balance: -amount}
                }
            );
            console.log("User punished.", userid);
            return message.channel.send("You are not allowed to send that word here.");
        };
    };
    //END OF ALGO
    logData(message)
    isBad(message)
    isGood(message)
    if (message.content in replies) {
        message.reply(replies[message.content]);
        return;
    }
    
});

// kacper and kaylon, start modifying this 
async function isBad(message) {
    let messageString= message.content.toLowerCase();
    if (swearjar.profane(messageString) && (messageString.includes("china") || messageString.includes("ccp") || messageString.includes("trash") || messageString.includes("bad"))) {
        //score the bitch
        const userid = message.author.id
        user = await message.client.dbInstance.collection('users').findOne({uuid:userid})
        nOffenses = user.offenses
        message.reply(nOffenses.toString())
        const deduct = 1;
        userU = await message.client.dbInstance.collection('users').updateOne(
            { uuid: userid },
            {
                $inc: {balance: -deduct}
            }
        )
        console.log(`deducted 10 from ${userid}`)
        message.channel.send(`-${deduct} social credit <@!${userid}>`)
        try{
            message.delete()
        }
        catch{
            return
        }
    } else {
    }
}
async function isGood(message) {
	let messageString = message.content.toLowerCase();
	if (
		messageString.includes("good") &&
		(messageString.includes("china") || messageString.includes("ccp"))
	) {
		//score the bitch
		const userid = message.author.id;
		const add = 10;
		userU = await message.client.dbInstance.collection("users").updateOne(
			{ uuid: userid },
			{
				$inc: { balance: add },
			}
		);
		console.log(`added 10 to ${userid}`);
		message.channel.send(`+${add} social credit <@!${userid}>`);
		try {
			message.delete;
		} catch {
			return;
		}
	} else {
	}
}

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
            commandhelp.execute(message, argshelp);
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
                };
            } else if (command.needsadmin) {
                if (currentMember.permissions.has(['ADMINISTRATOR']) || message.author.id == ownerID) {
                    exeCommand(command, message, args);
                    return;
                } else {
                };
            } else {
                exeCommand(command, message, args);
            };
        };
    } catch (error) {
        console.error(`Command perms check: ${error}`);
        message.reply('there was an error trying to execute that command!');
    };


};
