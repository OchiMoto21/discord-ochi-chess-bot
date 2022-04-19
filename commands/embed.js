// const regex = /([^,]+)/gm;
const request = require('request');

module.exports = {
    name: 'embed',
    aliases: ['edit'],
    description: "This command will embed and return a button",
    async execute(message, args, cmd, client, Discord){
        
        const memberMessageEmbed = new Discord.MessageEmbed()
        
            if(cmd === 'embed'){
                try {
                    if (!args.length){
                        if(message.attachments.size === 1){
                            console.log("Yes, there's an attachemnt");
                            request(message.attachments.first().url, 
                                function (error, response, body) {
                                    console.error('error:', error); // Print the error if one occurred
                                    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                                    console.log('body:', body); // Print the HTML for the Google homepage.
                            });
                        }
                    } else {
                        return message.channel.send({embeds : [memberMessageEmbed
                            .setTitle("There's no attachment.")
                            .setDescription("This message will be deleted in 10 seconds.")
                            ]}).then(msg => {setTimeout(() => msg.delete(), 10000)});
                    }
                    var iWantButtonsDaddy = [];
                            
                    const m = args.join(" ").split(',');
                    console.log(m);
                        
                    if (m.length % 2 == 0){
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
