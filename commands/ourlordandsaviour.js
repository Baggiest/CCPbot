module.exports = {
    name: 'ourlordandsaviour',
    description: 'pong!',
    cooldown: 5,
    async execute(message, args) {
        const m = await message.channel.send({ files: ["./files/lord.jpg"]});
    },
};