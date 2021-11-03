module.exports = {
<<<<<<< HEAD
    name: 'dbtest',
    description: 'test!',
    cooldown: 5,
    async execute(message, args) {
        const items = await message.client.dbInstance.collection('config').findOne({ ping: "pong" });
        message.reply(items.ping)
    },
};
=======
  name: 'dbtest',
  description: 'test!',
  cooldown: 5,
  async execute(message, args, client) {
    const items = await message.client.dbInstance.collection('config').findOne({ ping: 'pong' });
    message.reply(items.ping);
  },
};
>>>>>>> 2ce8cad18fbe670fa3db7c16f12e9de172f43cfe
