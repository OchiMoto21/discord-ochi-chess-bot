const EmbedBuilder = require('../schemas/EmbedBuilder');

module.exports = {
    name: 'swap',
    aliases: [],
    description: "This command will embed or return a button",
    async execute(message, args, cmd, client, Discord){
        console.log('Embedv2!');
        const EmbedBuilderUser = await client.createEmbedBuilder(message.guild,message.member);
        let messageTitles = [];
        let messages = EmbedBuilderUser.messages;

        if ((messages.length >= parseInt(args[0]))&&(messages.length >= parseInt(args[1])) && (!args[0] <= 0) && (!args[1] <= 0)){    
            var temp = messages[parseInt(args[0]-1)];
            messages[parseInt(args[0])-1] = messages[parseInt(args[1]-1)];
            messages[parseInt(args[1])-1] = temp;
            await EmbedBuilderUser.save();
        }
    }
}