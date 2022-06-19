const EmbedBuilder = require('../schemas/EmbedBuilder');

module.exports = {
    name: 'timer',
    aliases: [],
    description: "This command will embed or return a button",
    async execute(message, args, cmd, client, Discord){
        
        if (args.length > 1 && Number.isInteger(parseInt(args[0]))){
            var time = parseInt(args[0])*1000
            console.log('timer');
            const timer = {
                color: "#6f8fb9",
                author: {
                    name : message.author.tag,
                    icon_url : message.author.avatarURL(), 
                },
                title:"Timer set.",
                description : "Will remind you about "+ args.slice(1).join(" ") +" in " + args[0] + " seconds."
            }
            const reminder = {
                color: "#6f8fb9",
                author: {
                    name : message.author.tag,
                    icon_url : message.author.avatarURL(), 
                },
                title:"Time is up.",
                description : "It's been " + args[0] + " seconds since "+ args.slice(1).join(" ") + "."
            }
            await message.channel.send({
                    embeds : [timer]
                    })
                    .then(msg => {setTimeout(() =>{
                            message.channel.send({
                                embeds : [reminder]
                            });
                            msg.delete();
                        } 
                        , time)});
        
        }

    }
}