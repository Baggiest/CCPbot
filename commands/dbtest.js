module.exports = {
  name: 'dbtest',
  description: 'test!',
  cooldown: 5,
  async execute(message, args, client) {
    const db = client.modules.get('db').getInstance();
    const items = await db.collection('config').findOne({ ping: 'pong' });
    message.reply(items.ping);
  },
};
