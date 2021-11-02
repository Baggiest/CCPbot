const Discord = require('discord.js');

module.exports = class CommandsModule {
  constructor(ccpClient) {
    this.commands = new Discord.Collection();
    this.cooldowns = new Discord.Collection();
    this.ccpClient = ccpClient;

    this.ccpClient.registerEvent(
      'messageCreate',
      this.handleMessage.bind(this)
    );
  }

  async handleMessage(message) {
    const prefix = this.ccpClient.settings.get('prefix');
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const [commandName = commandName.toLowerCase(), ...args] = message.content
      .slice(prefix.length)
      .split(/\s+/);

    if (!this.commands.has(commandName)) return;
    const command = this.commands.get(commandName);
    command.execute(message, args);
  }
};
