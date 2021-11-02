const CCPClient = require('./client/ccp-client');
const SettingsProvider = require('./client/settings-provider');
const CommandsModule = require('./client/modules/commands');
const config = require('./config.json');

const settings = new SettingsProvider(config);
const client = new CCPClient(settings);
client.registerModule(CommandsModule);
client.init();
