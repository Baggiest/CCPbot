module.exports = {
    name: 'test',
    description: 'test',
    cooldown: 5,
    async execute(message, args) {
        message.reply(`This file test is imported.`);
    },
};