const delimiter = "|";
module.exports = {
    name: 'edit',
    aliases: [],
    description: "This command will embed or return a button",
    async execute(message, args, cmd, client, Discord){
        
        var embed = new Discord.MessageEmbed()

        if(cmd === 'edit'){
            try {
                if (!args.length && !(message.attachments.size === 1)) return channel.send("There's no argument D:");
                var buttoArray = [];
                var embed = new Discord.MessageEmbed();
                const m = args.join(" ").split(delimiter);

                var image = ""; 
                var title = "";
                var description_state = false;
                var title_state = false;

                var channelID = m[0];
                var messageID = m[1];
                m.shift();
                m.shift();
                var channel = message.channel;
                        
                if (!m.length == 0){
                    var title_state = m[0].startsWith("title.");
                    if (title_state){
                        var title = m[0];
                        m.shift();
                        if (title.length > 256){
                            return channel.send({
                                embeds : [embed
                                    .setTitle('Embed title exceeded 256 characters.')
                                    .setColor('#dc661f')
                                ]
                            }).then(msg => {setTimeout(() => msg.delete(), 10000)});
                        }
                    }
                }
                console.log(m.length);

                if (!m.length == 0){
                    var description_state = m[0].startsWith("description.");
                    if (description_state){
                        var description = m[0];
                        m.shift();
                        if (description.length > 4096){
                            return channel.send({
                                embeds : [embed
                                    .setTitle('Embed description exceeded 4096 characters.')
                                    .setColor('#dc661f')
                                ]
                            }).then(msg => {setTimeout(() => msg.delete(), 10000)});
                        }
                    }
                }
                console.log(m.length);
                if (!m.length == 0){
                    var image_state = m[0].startsWith("image.");
                    if (image_state){
                        var image = m[0].trim().slice(6);
                        m.shift();
                        if (!isValidURL(image)){
                            return channel.send({embeds : [embed
                                .setTitle("Not a valid image URL.")
                                .setDescription("This message will be deleted in 10 seconds.")
                                ]}).then(msg => {setTimeout(() => msg.delete(), 10000)});
                        }
                    }
                }
                if (message.attachments.size === 1 && message.attachments.first().contentType.startsWith("image")){
                    var image = message.attachments.first().url;
                    if (!isValidURL(image)){
                        return channel.send({embeds : [embed
                            .setTitle("Not a valid image URL.")
                            .setDescription("This message will be deleted in 10 seconds.")
                            ]}).then(msg => {setTimeout(() => msg.delete(), 10000)});
                    }
                }
                console.log(m.length);

                var image_response = (message.attachments.size === 1 && message.attachments.first().contentType.startsWith("image")) || image_state;
                
                var one_row = (!m.length == 0 && m.length/2 <= 5 && m.length % 2 == 0);

                const regex = /^(?:<:|<a:)(?<emojiName>\w+):(?<emojiID>\d+)>(?<buttonLabel>.+|)$/;
                
                if (!one_row && !m.length == 0) {
                    return channel.send({embeds : [embed
                        .setTitle("You excedeed the maximum of five buttons.")
                        .setDescription("This message will be deleted in 10 seconds.")
                        ]}).then(msg => {setTimeout(() => msg.delete(), 10000)});
                };
                console.log(m.length);

                message.delete();
                if(!m.length == 0 && m.length/2 <= 5 && m.length % 2 == 0){
                    console.log(regex);
                    console.log(m.length);

                    for (var j = 0; j < (m.length); j += 2) {
                        if (!isValidURL(m[j+1].trim())){
                            return channel.send({embeds : [embed
                                .setTitle("Not a valid button URL.")
                                .setDescription("This message will be deleted in 10 seconds.")
                                ]}).then(msg => {setTimeout(() => msg.delete(), 10000)});
                        }
                        if (m[j].length > 80 && !(regex.test(m[j]))){
                            return channel.send({
                                embeds : [embed
                                    .setTitle('|'+m[j]+'| button\'s label exceeded 80 characters humu')
                                    .setColor('#dc661f')
                                ]
                            }).then(msg => {setTimeout(() => msg.delete(), 10000)});
                        } else if (regex.test(m[j])){
                            var groups = m[j].trim().match(regex).groups;
                            if(!(groups.buttonLabel.length > 80)){
                                buttoArray.push(new Discord.MessageButton()
                                    .setLabel(groups.buttonLabel)
                                    .setStyle('LINK')
                                    .setURL(m[j+1].trim())
                                    .setEmoji(groups.emojiID)
                                    )                                
                            } else {

                                return channel.send({
                                    embeds : [embed
                                        .setTitle('|'+m[j]+'| button\'s label exceeded 80 characters')
                                        .setColor('#dc661f')
                                    ]
                                }).then(msg => {setTimeout(() => msg.delete(), 10000)});
                            }
                        } else {
                            
                            buttoArray.push(new Discord.MessageButton()
                                .setLabel(m[j].trim())
                                .setStyle('LINK')
                                .setURL(m[j+1].trim())
                                )
                        }
                        
                    }
                    
                    var row = new Discord.MessageActionRow()
                    .addComponents(
                        buttoArray
                    );
                    
                    if (image_response){
                        if(description_state && title_state) {
                            client.channels.cache.get(channelID).messages.fetch(messageID)
                                .then(msg => {
                                    var embed = msg.embeds[0];
                                    msg.edit({
                                        embeds : [embed
                                            .setTitle(title.slice(6))
                                            .setDescription(description.slice(12))
                                            .setColor('#dc661f')
                                            .setImage(image)
                                            ],
                                        components: [row]
                                    })
                                }
                                )
                        } else if (title_state) {
                            client.channels.cache.get(channelID).messages.fetch(messageID)
                                .then(msg => {
                                    var embed = msg.embeds[0];
                                    
                                    msg.edit({
                                        embeds : [embed
                                            .setTitle(title.slice(6))
                                            .setColor('#dc661f')
                                            .setImage(image)
                                            ],
                                        components: [row]
                                    })
                                }
                                )
                        } else if (description_state) {
                            client.channels.cache.get(channelID).messages.fetch(messageID)
                                .then(msg => {
                                    var embed = msg.embeds[0];
                                    msg.edit({
                                        embeds : [embed
                                            .setDescription(description.slice(12))
                                            .setColor('#dc661f')
                                            .setImage(image)
                                            ],
                                        components: [row]
                                    })

                                }
                                )
                        } else {
                            console.log("destination");
                            client.channels.cache.get(channelID).messages.fetch(messageID)
                                .then(msg => {
                                    var embed = msg.embeds[0];
                                    msg.edit({
                                        embeds : [embed
                                            .setColor('#dc661f')
                                            .setImage(image)
                                            ],
                                        components: [row]
                                    })

                                }
                                )
                        }
                    } else {

                        if(description_state && title_state) {
                            client.channels.cache.get(channelID).messages.fetch(messageID)
                                .then(msg => {
                                    var embed = msg.embeds[0];
                                    msg.edit({
                                        embeds : [embed
                                            .setTitle(title.slice(6))
                                            .setDescription(description.slice(12))
                                            .setColor('#dc661f')
                                            ],
                                        components: [row]
                                    })
                                }
                                )
                        } else if (title_state){
                            client.channels.cache.get(channelID).messages.fetch(messageID)
                            .then(msg => {
                                var embed = msg.embeds[0];
                                msg.edit({
                                    embeds : [embed
                                        .setTitle(title.slice(6))
                                        .setColor('#dc661f')
                                    ],
                                    components: [row]
                                })
                            }
                            )
                        } else if (description_state){
                            client.channels.cache.get(channelID).messages.fetch(messageID)
                            .then(msg => {
                                var embed = msg.embeds[0];
                                msg.edit({
                                    embeds : [embed
                                        .setDescription(description.slice(12))
                                        .setColor('#dc661f')
                                    ],
                                    components: [row]
                                })
                            }
                            )
                        } else {
                            console.log('tujuan');
                            client.channels.cache.get(channelID).messages.fetch(messageID)
                            .then(msg =>
                                msg.edit({
                                    components: [row]
                                })
                            )
                        }
                    }
                } else {
                    if (image_response){
                        if(description_state && title_state) {
                            client.channels.cache.get(channelID).messages.fetch(messageID)
                                .then(msg => 
                                    msg.edit({
                                        embeds : [embed
                                            .setTitle(title.slice(6))
                                            .setDescription(description.slice(12))
                                            .setColor('#dc661f')
                                            .setImage(image)
                                            ],
                                        components: []
                                    }
                                    )
                                )
                        } else if (title_state) {
                            
                            client.channels.cache.get(channelID).messages.fetch(messageID)
                                .then(msg => {
                                    var embed = msg.embeds[0];

                                    msg.edit({
                                        embeds : [embed
                                            .setTitle(title.slice(6))
                                            .setColor('#dc661f')
                                            .setImage(image)
                                            ]
                                    })
                                }
                                );
                        } else if (description_state) {
                            
                                client.channels.cache.get(channelID).messages.fetch(messageID)
                                    .then(msg => {
                                        var embed = msg.embeds[0];
                                        msg.edit({
                                            embeds : [embed
                                                .setDescription(description.slice(12))
                                                .setColor('#dc661f')
                                                .setImage(image)
                                                ]
                                        })
                                    }
                                    )
                        } else {
                            client.channels.cache.get(channelID).messages.fetch(messageID)
                                .then(msg => {
                                    var embed = msg.embeds[0];
                                    msg.edit({
                                        embeds : [embed
                                            .setColor('#dc661f')
                                            .setImage(image)
                                            ]

                                    })
                                }
                                )
                        }
                    } else {
                        if (description_state && title_state) {
                            client.channels.cache.get(channelID).messages.fetch(messageID)
                                .then(msg => {
                                    var embed = msg.embeds[0];
                                    msg.edit({
                                        embeds : [embed
                                            .setTitle(title.slice(6))
                                            .setDescription(description.slice(12))
                                            .setColor('#dc661f')
                                            ]
                                    })
                                })
                        } else if (title_state){
                            client.channels.cache.get(channelID).messages.fetch(messageID)
                            .then(msg => {
                                var embed = msg.embeds[0];
                                msg.edit({
                                    embeds : [embed
                                        .setTitle(title.slice(6))
                                        .setColor('#dc661f')
                                    ]
                                })
                            }
                            )
                        } else if (description_state) {

                            client.channels.cache.get(channelID).messages.fetch(messageID)
                                .then(msg => {
                                    var embed = msg.embeds[0];
                                    msg.edit({
                                        embeds : [embed
                                            .setDescription(description.slice(12))
                                            .setColor('#dc661f')
                                            ]
                                    })
                                })
                        } else {
                            
                            return;
                        }
                    }
                    
                }
            } catch {
                console.error;
                channel.send({embeds : [new Discord.MessageEmbed()
                    .setTitle("Not a valid argument.")
                    .setDescription("This message will be deleted in 10 seconds.")
                    ]}).then(msg => {setTimeout(() => msg.delete(), 10000)});
            }
        }
    }
}

function isValidURL(string) {
    var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return (res !== null)
};