const EmbedBuilder = require('../schemas/EmbedBuilder');

module.exports = {
    name: 'send',
    aliases: ['edit'],
    description: "This command will embed or return a button",
    async execute(message, args, cmd, client, Discord){
        console.log('Embedv2!');
        const EmbedBuilderUser = await client.createEmbedBuilder(message.guild,message.member);
        
        if (cmd == "send" && args[0] == "all"){
            let messages = EmbedBuilderUser.messages;
            for (const oneMessage of messages){
                try {
                    await message.channel.send({
                        embeds: [oneMessage.embed],
                        components: client.buttonRowGenerator(oneMessage.button)
                    })
                } catch(error) {
                    console.error(error);
                    try {
                        await message.channel.send({
                            components: client.buttonRowGenerator(oneMessage.button)
                        });
                    } catch (error) {
                        console.error(error);
                        const embed = {
                            color: "#6f8fb9",
                            author: {
                                name : message.author.tag,
                                icon_url : message.author.avatarURL(), 
                            },
                            description : oneMessage.name +" message is empty",
                        }
                        await message.channel.send({
                            embeds : [embed],
                        }).then(msg => {setTimeout(() => msg.delete(), 10000)});
                    }
                };
            };
            return;
        }
            let title = client.titleDoko(args.join(" "))[0];
            args = client.titleDoko(args.join(" "))[1];
            let messages = EmbedBuilderUser.messages;
            let oneMessage = messages.find(o => o["name"] === title);
            if(oneMessage){
                if (cmd == "send"){
                    try {
                        await message.channel.send({
                            embeds: [oneMessage.embed],
                            components: client.buttonRowGenerator(oneMessage.button)
                        })
                    } catch(error) {
                        console.error(error);
                        try {
                            await message.channel.send({
                                components: client.buttonRowGenerator(oneMessage.button)
                            });
                        } catch (error) {
                            console.error(error);
                            const embed = {
                                color: "#6f8fb9",
                                author: {
                                    name : message.author.tag,
                                    icon_url : message.author.avatarURL(), 
                                },
                                description : oneMessage.name +" message is empty",
                            }
                            return await message.channel.send({
                                embeds : [embed],
                            }).then(msg => {setTimeout(() => msg.delete(), 10000)});
                        
                        }
                    };
                }
                if (cmd == "edit"){
                    if (!client.isValidURL(args[0])) return;
                    var id = args[0].split("/");
                    if(!(id[id.length-1].length == 18 && id[id.length-2].length == 18)) return;
                    
                    var chnl = await client.channels.fetch(id[id.length-2]);
                    var msg = await chnl.messages.fetch(id[id.length-1]);
                    try {
                        await msg.edit({
                            embeds: [oneMessage.embed],
                            components: client.buttonRowGenerator(oneMessage.button)
                        })
                    } catch(error) {
                        console.error(error);
                        try {
                            await msg.edit({
                                components: client.buttonRowGenerator(oneMessage.button)
                            });
                        } catch (error) {
                            console.error(error);
                            const embed = {
                                color: "#6f8fb9",
                                author: {
                                    name : message.author.tag,
                                    icon_url : message.author.avatarURL(), 
                                },
                                description : oneMessage.name +" message is empty",
                            }
                            return await message.channel.send({
                                embeds : [embed],
                            }).then(msg => {setTimeout(() => msg.delete(), 10000)});
                        
                        }
                    };
                }
        } else {
            console.log("message not found")
        }
    }
}


