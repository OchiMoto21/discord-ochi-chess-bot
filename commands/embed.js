// const regex = /([^,]+)/gm;
module.exports = {
    name: 'embed',
    aliases: ['edit'],
    description: "This command will embed and return a button",
    async execute(message, args, cmd, client, Discord){
        
        const memberMessageEmbed = new Discord.MessageEmbed()
        
            if(cmd === 'embed'){
                try {
                    if (!args.length) return message.channel.send("There's no argument D:");
                    var iWantButtonsDaddy = [];
                            
                    const m = args.join(" ").split(',');
                    console.log(m);
                    if (m[0]="webhook"){

                        const webhooks = await channel.fetchWebhooks();
                        const webhook = webhooks.find(wh => wh.token);
                
                        if (!webhook) {
                            return console.log('No webhook was found that I can use!');
                        }
                        
                        for (var i = 1; i < m.length/2; ++i) {
                            iWantButtonsDaddy[i] = new Discord.MessageButton()
                            .setLabel(m[i*2])
                            .setStyle('LINK')
                            .setURL(m[i*2+1])
                        }
                        
                        const row = new Discord.MessageActionRow()
                        .addComponents(
                            iWantButtonsDaddy
                        );
                        if (message.attachments.size === 1){
                            webhook.send({
                                content: 'Webhook test',
                                username: m[1],
                                avatarURL: 'https://media.discordapp.net/attachments/823129376068599830/965558750746390528/Ninja_2.png?width=701&height=701',
                                embeds: [memberMessageEmbed
                                    .setColor('#dc661f')
                                    .setImage(message.attachments.first().url)],
                                components: [row]
                            });
                        } else {
                            webhook.send({
                                content: 'Webhook test',
                                username: m[1],
                                avatarURL: 'https://media.discordapp.net/attachments/823129376068599830/965558750746390528/Ninja_2.png?width=701&height=701',
                                embeds: [memberMessageEmbed
                                    .setTitle("There's no picture. Daijoubuka?")
                                    .setDescription("This message will be deleted in 10 seconds.")
                                    ],
                            })
                            .then(msg => {setTimeout(() => msg.delete(), 10000)});
                            webhook.send({
                                components: [row]
                            });
                        }
                    }
                    if(m.length % 2 == 0){
                        console.log(m.length);
                        for (var i = 1; i <= m.length/2; ++i) {
                            iWantButtonsDaddy[i] = new Discord.MessageButton()
                            .setLabel(m[i*2-2])
                            .setStyle('LINK')
                            .setURL(m[i*2-1])
                        }
                        
                        const row = new Discord.MessageActionRow()
                        .addComponents(
                            iWantButtonsDaddy
                        );
            
                        if (message.attachments.size === 1){
                            message.channel.send({
                                embeds : [memberMessageEmbed
                                    .setColor('#dc661f')
                                    .setImage(message.attachments.first().url)
                                    ],
                                components: [row]
                            })
                            message.delete()
                        } else {
                            message.delete()
                            message.channel.send({embeds : [memberMessageEmbed
                                .setTitle("There's no picture. Daijoubuka?")
                                .setDescription("This message will be deleted in 10 seconds.")
                                ]}).then(msg => {setTimeout(() => msg.delete(), 10000)})
                            message.channel.send({
                                components: [row]
                            })
                        }
                    } else {
                        message.channel.send({embeds : [memberMessageEmbed
                            .setTitle("Not a valid argument.")
                            .setDescription("This message will be deleted in 10 seconds.")
                            ]}).then(msg => {setTimeout(() => msg.delete(), 10000)})
                    }
                } catch {
                    console.error;
                    message.delete();
                    message.channel.send({embeds : [memberMessageEmbed
                        .setTitle("Not a valid argument.")
                        .setDescription("This message will be deleted in 10 seconds.")
                        ]}).then(msg => {setTimeout(() => msg.delete(), 10000)});
                }
            }
            if(cmd === 'edit'){
                try {
                    if (!args.length) return message.channel.send("There's no argument D:");
                    var iWantButtonsDaddy = [];
                    // first and second argument is channelid and messageid            
        
                    // Alternative syntax using RegExp constructor
                    // const regex = new RegExp('([^,]+)', 'gm')
        
                    const m = args.join(" ").split(',');
                    console.log(m);
                    if(m.length % 2 == 0){
                        console.log(m.length);
                        for (var i = 1; i < m.length/2; ++i) {
                            iWantButtonsDaddy[i] = new Discord.MessageButton()
                            .setLabel(m[i*2])
                            .setStyle('LINK')
                            .setURL(m[i*2+1])
                        }
                        
                        const row = new Discord.MessageActionRow()
                        .addComponents(
                            iWantButtonsDaddy
                        );
            
                        if (message.attachments.size === 1){
                            client.channels.cache.get(m[0]).messages.fetch(m[1])
                                .then(msg => 
                                    msg.edit({
                                        embeds : [memberMessageEmbed
                                            .setColor('#dc661f')
                                            .setImage(message.attachments.first().url)
                                            ],
                                        components: [row]
                                    })
                                )
                                .catch(
                                    console.error,
                                    message.channel.send({embeds : [memberMessageEmbed
                                        .setTitle("Not a valid argument.")
                                        .setDescription("False message ID or channel ID.\nThis message will be deleted in 10 seconds.")
                                        ]}).then(msg => {setTimeout(() => msg.delete(), 10000)})
                                );
                                message.delete()
                        } else {
                            client.channels.cache.get(m[0]).messages.fetch(m[1])
                            .then(msg => 
                                msg.edit({
                                    components: [row]
                                })
                            )
                            .catch(
                                console.error,
                                message.channel.send({embeds : [memberMessageEmbed
                                    .setTitle("Not a valid argument.")
                                    .setDescription("False message ID or channel ID.\nThis message will be deleted in 10 seconds.")
                                    ]}).then(msg => {setTimeout(() => msg.delete(), 10000)})
                            );
                            message.delete()
                        }
                    } else {
                        message.channel.send({embeds : [memberMessageEmbed
                            .setTitle("Not a valid argument.")
                            .setDescription("This message will be deleted in 10 seconds.")
                            ]}).then(msg => {setTimeout(() => msg.delete(), 10000)});
                        message.delete();
                    }
                } catch {
                    console.error;
                    message.delete();
                    message.channel.send({embeds : [memberMessageEmbed
                        .setTitle("Not a valid argument.")
                        .setDescription("This message will be deleted in 10 seconds.")
                        ]}).then(msg => {setTimeout(() => msg.delete(), 10000)});
                }
            }
        
    }    
}
