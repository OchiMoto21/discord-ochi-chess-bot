const delimiter = "|";
module.exports = {
    name: 'edit',
    aliases: [],
    description: "This command will embed or return a button",
    async execute(message, args, cmd, client, Discord){
        
        var embed = new Discord.MessageEmbed()

        if(cmd === 'edit'){
            try {
                if (!args.length && !(message.attachments.size === 1)) return message.channel.send("There's no argument D:");
                var buttoArray = [];
                var embed = new Discord.MessageEmbed();
                const m = args.join(" ").split(delimiter);

                var title = ""; 
                var channelID = m[0];
                var messageID = m[1];
                console.log(channelID,messageID);

                m.shift();
                m.shift();
                if (!m.length == 0){
                    var title_state = m[0].startsWith("title.");
                    var description_state = false;
                    if (title_state){
                        var title = m[0];
                        m.shift();

                    }
                }

                if (!m.length == 0){
                    var description_state = m[0].startsWith("description.");
                    if (description_state){
                        var description = m[0];
                        m.shift();
                    }
                }
                if (!m.length == 0){
                    var image_state = m[0].startsWith("image.");
                    if (image_state){
                        var image = m[0].trim().slice(6);
                        m.shift();
                        console.log(image);
                    }
                }
                if (message.attachments.size === 1 && message.attachments.first().contentType.startsWith("image")){
                    var image = message.attachments.first().url;
                }

                var image_response = (message.attachments.size === 1 && message.attachments.first().contentType.startsWith("image")) || image_state;

                const regex = /^(?:<:|<a:)(?<emojiName>\w+):(?<emojiID>\d+)>(?<buttonLabel>.+|)$/;
                if(!m.length == 0 && m.length/2 <= 5 && m.length % 2 == 0){
                    console.log(regex);

                    for (var j = 0; j < (m.length); j += 2) {
                        var bool = regex.test(m[j]);
                        console.log(bool);
                        
                        if (m[j].length > 80 && !(regex.test(m[j]))){
                            return message.channel.send({
                                embeds : [embed
                                    .setTitle('|'+m[j]+'| button\'s label exceeded 80 characters humu')
                                    .setColor('#dc661f')
                                ]
                            }).then(msg => {setTimeout(() => msg.delete(), 10000)});
                        } else if (regex.test(m[j])){
                            var groups = m[j].match(regex).groups;
                            if(!(groups.buttonLabel.length > 80)){
                                buttoArray.push(new Discord.MessageButton()
                                    .setLabel(groups.buttonLabel)
                                    .setStyle('LINK')
                                    .setURL(m[j+1].trim())
                                    .setEmoji(groups.emojiID)
                                    )                                
                            } else {

                                return message.channel.send({
                                    embeds : [embed
                                        .setTitle('|'+m[j]+'| button\'s label exceeded 80 characters')
                                        .setColor('#dc661f')
                                    ]
                                }).then(msg => {setTimeout(() => msg.delete(), 10000)});
                            }
                        } else {
                            
                            buttoArray.push(new Discord.MessageButton()
                                .setLabel(m[j])
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
                            message.delete();
                            return;
                        }
                    }
                    
                }
                message.delete()
            } catch {
                console.error;
                message.delete();
                message.channel.send({embeds : [new Discord.MessageEmbed()
                    .setTitle("Not a valid argument.")
                    .setDescription("This message will be deleted in 10 seconds.")
                    ]}).then(msg => {setTimeout(() => msg.delete(), 10000)});
            }
        }
    }
}