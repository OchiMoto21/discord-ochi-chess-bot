const EmbedBuilder = require('../schemas/EmbedBuilder');

module.exports = {
    name: 'list',
    aliases: [],
    description: "This command will embed or return a button",
    async execute(message, args, cmd, client, Discord){
        console.log('Embedv2!');
        const EmbedBuilderUser = await client.createEmbedBuilder(message.guild,message.member);
        let messageTitles = [];
        let messages = EmbedBuilderUser.messages;
        messages.forEach(element => {
            messageTitles.push(messages.indexOf(element)+1+". " + element.name);
        });
        console.log(messageTitles);
        const embed = {
            color: "#6f8fb9",
            author: {
                name : message.author.tag,
                icon_url : message.author.avatarURL(), 
            },
            title : "Messages List",
        }
        if (!messageTitles.length == 0) embed.description = messageTitles.join("\n");

        await message.channel.send({
            embeds : [embed],
        })
    }
}
