module.exports = {
    name: 'balance',
    description: 'prints your social balance',
    cooldown: 5,
        }
        const user = await message.client.dbInstance.collection('users').findOne({ uuid: userObj });
        message.reply(user.balance.toString());
    },
};