module.exports = {
    name: 'dbtest',
    description: 'test!',
    cooldown: 5,
    async execute(message, args) {
        const items = await message.client.dbInstance.collection('config').findOne({ ping: "pong" });
        message.reply(items.ping)
    },
};