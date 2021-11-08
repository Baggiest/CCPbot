// module.exports = {
//     name: 'help',
//     description: 'help command',
//     cooldown: 5,
//     async execute(message, bot, commandFiles, args, client, commands, con, fs) {
//             fs.readdir("./commands/", (err, files) => {
//             if(err) console.error(err);

//             let jsFiles = files.filter(f => f.split(".").pop()==="js");
//             if(jsFiles.length <= 0) { 
//                 console.log("No cmds to load!");
//                 return;
//           }

//             let result = jsFiles.forEach((f, i)=> {
//                 let props = require(`./${f}`);
//                 let filesArray = [props.help.name, props.help.description, props.help.usage]
//                 message.author.send(`**${filesArray[0]}** \n${filesArray[1]} \n${filesArray[2]}`);
//           });
//         });
//     },
// };
