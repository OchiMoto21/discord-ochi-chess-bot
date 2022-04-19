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
                                    console.error('error:', error); 
                                    console.log('statusCode:', response && response.statusCode); 
                                    console.log('body:', body);
                                    const str = body.trim().replace(/(\r\n|\n|\r)/gm, "\n").split("\n");
                                    console.log('str:', str);
                                    console.log('str.length:', str.length);
                                    for(var i = 0; i < parseInt(str.length); ++i){
                                        try {

                                            var iWantButtonsDaddy = [];
                                            var m = [];
                                            var embed = new Discord.MessageEmbed()
                                            var title = ""; 
                                            var image = "";
                                            var m = String(str[i]).split(',');
                                            console.log(str[i]);
                                            console.log(m.length);
                                            var image_state = m[0].startsWith("image.no");
                                            var title_state = m[1].startsWith("title.");
                                            if(title_state){
                                                if (image_state){
                                                    m.shift();
                                                } else {
                                                    var image = m[0];
                                                    m.shift();
                                                }
                                                var title = m[0];
                                                m.shift();
                                                console.log(m.length);
                                                console.log(m);
                                                if (!m.length == 0 && m.length/2 <= 5 && m.length % 2 == 0){
                                                    for (var j = 1; j <= (m.length)/2; ++j) {
                                                        iWantButtonsDaddy[j] = new Discord.MessageButton()
                                                        .setLabel(m[j*2-2])
                                                        .setStyle('LINK')
                                                        .setURL(m[j*2-1])
                                                    }
                                                    var row = new Discord.MessageActionRow()
                                                    .addComponents(
                                                        iWantButtonsDaddy
                                                    );
                                                }
                                                if (!m.length == 0 && m.length/2 <= 5){
                                                    if (image_state){
                                                        message.channel.send({
                                                            embeds : [embed
                                                                .setTitle(title.slice(6))
                                                                .setColor('#dc661f')
                                                                ],
                                                            components: [row]
                                                        })
                                                    } else {
                                                        message.channel.send({
                                                            embeds : [embed
                                                                .setTitle(title.slice(6))
                                                                .setColor('#dc661f')
                                                                .setImage(image)
                                                                ],
                                                            components: [row]
                                                        })
                                                    }
                                                } else{
                                                    if (image_state){
                                                        message.channel.send({
                                                            embeds : [embed
                                                                .setTitle(title.slice(6))
                                                                .setColor('#dc661f')
                                                                ]
                                                        })
                                                    } else {
                                                        message.channel.send({
                                                            embeds : [embed
                                                                .setTitle(title.slice(6))
                                                                .setColor('#dc661f')
                                                                .setImage(image)
                                                                ]
                                                        })
                                                    }
                                                }

                                            } else {
                                                if (image_state){
                                                    m.shift();
                                                } else {
                                                    var image = m[0];
                                                    m.shift();
                                                }
                                                console.log(m.length);
                                                console.log(m);
                                                if (!m.length == 0 && m.length/2 <= 5){
                                                    for (var j = 1; j <= (m.length)/2; ++j) {
                                                        iWantButtonsDaddy[j] = new Discord.MessageButton()
                                                        .setLabel(m[j*2-2])
                                                        .setStyle('LINK')
                                                        .setURL(m[j*2-1])
                                                    }
                                                    var row = new Discord.MessageActionRow()
                                                    .addComponents(
                                                        iWantButtonsDaddy
                                                    );
                                                }
                                                if(!m.length == 0 && m.length/2 <= 5){
                                                    if (image_state){
                                                        console.log("Testing button only");
                                                        message.channel.send({
                                                            components: [row]
                                                        })
                                                    } else {
                                                        console.log("Testing button with image");
                                                        message.channel.send({
                                                            embeds : [embed
                                                                .setColor('#dc661f')
                                                                .setImage(image)
                                                                ],
                                                            components: [row]
                                                        })
                                                    }
                                                } else {
                                                    if (!image_state){
                                                        console.log("Testing image only");
                                                        message.channel.send({
                                                            embeds : [embed
                                                                .setColor('#dc661f')
                                                                .setImage(image)
                                                                ]
                                                        })
                                                    }
                                                }

                                            }
                                        } catch {
                                            console.error;
                                            return message.channel.send({embeds : [memberMessageEmbed
                                                .setTitle("Failed to read text file.")
                                                .setDescription("This message will be deleted in 10 seconds.")
                                                ]}).then(msg => {setTimeout(() => msg.delete(), 10000)})        
                                        }
                                        console.log('row:',i);
                                    }
                                }
                            );
                            message.delete();
                            return;
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
                    const m = args.join(" ").split(',');
                    console.log(m);
                    var title = ""; 
                    var channelID = m[0];
                    var messageID = m[1];
                    m.shift();
                    m.shift();
                    var title_state = m[0].startsWith("title.");
                    
                    if (title_state){
                        m.shift();
                    } else {
                        var title = m[0];
                        m.shift();
                    }
                    
                    if(!m.length == 0 && m.length/2 <= 5 && m.length % 2 == 0){
                        console.log(m.length);
                        for (var j = 1; j <= (m.length)/2; ++j) {
                            iWantButtonsDaddy[j] = new Discord.MessageButton()
                            .setLabel(m[j*2-2])
                            .setStyle('LINK')
                            .setURL(m[j*2-1])
                        }
                        
                        var row = new Discord.MessageActionRow()
                        .addComponents(
                            iWantButtonsDaddy
                        );
                        if (message.attachments.size === 1){
                            if (title_state){
                                client.channels.cache.get(channelID).messages.fetch(messageID)
                                    .then(msg => 
                                        msg.edit({
                                            embeds : [memberMessageEmbed
                                                .setTitle(title)
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
                            } else {
                                client.channels.cache.get(channelID).messages.fetch(messageID)
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
                            }
                                message.delete()
                        } else {
                            if (title_state){
                                client.channels.cache.get(channelID).messages.fetch(messageID)
                                .then(msg => 
                                    msg.edit({
                                        embeds : [memberMessageEmbed
                                            .setTitle(title)
                                            .setColor('#dc661f')
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
                            }
                            else{
                                client.channels.cache.get(channelID).messages.fetch(messageID)
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
                            }
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
