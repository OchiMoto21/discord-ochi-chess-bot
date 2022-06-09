module.exports = {
    name: 'avatar',
    aliases: [],
    description: "This command will return avatar URL",
    async execute(message, args, cmd, client, Discord){
        if(message.channel.id == "825593098187833344"){
        
        client.users.fetch(args[0]).then((user) => {
            message.channel.send(user.avatarURL());
        }).catch(console.error);
        }
    }
}