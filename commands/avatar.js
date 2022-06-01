module.exports = {
    name: 'avatar',
    aliases: [],
    description: "This command will return avatar URL",
    async execute(message, args, cmd, client, Discord){

        client.users.fetch(args[0]).then((user) => {
            message.channel.send(user.avatarURL());
        }).catch(console.error);
    }
}