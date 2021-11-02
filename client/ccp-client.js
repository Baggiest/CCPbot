const Discord = require('discord.js');

const clientOptions = {
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_BANS,
    Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    Discord.Intents.FLAGS.GUILD_INTEGRATIONS,
    Discord.Intents.FLAGS.GUILD_WEBHOOKS,
    Discord.Intents.FLAGS.GUILD_PRESENCES,
    Discord.Intents.FLAGS.GUILD_MEMBERS,
    Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Discord.Intents.FLAGS.DIRECT_MESSAGES,
    Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
  ],
};

module.exports = class CCPClient {
  constructor(settingsProvider) {
    this.client = new Discord.Client(clientOptions);
    this.listeners = new Discord.Collection();
    this.modules = new Discord.Collection();
    this.settings = settingsProvider;
  }

  registerEvent(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
  }

  registerModule(module) {
    this.modules.set(Symbol.for(module.name), new module(this));
  }

  async init(token = this.settings.get('token')) {
    this.listeners.forEach((callbacks, event) =>
      this.client.on(event, async (...args) =>
        callbacks.forEach((callback) => callback(...args))
      )
    );

    this.client.login(token);
  }
};
