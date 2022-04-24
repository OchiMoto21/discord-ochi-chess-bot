// const regex = /([^,]+)/gm;
const request = require('request');
const delimiter = "|";
module.exports = {
    name: 'embed',
    aliases: ['edit','description'],
    description: "This command will embed or return a button",
    async execute(message, args, cmd, client, Discord){
        
        var embed = new Discord.MessageEmbed()
        
            if(cmd === 'embed'){
                try {
                    if (!args.length){
                        if(message.attachments.size === 1){
                            console.log("Yes, there's an attachemnt");
                            console.log(message.attachments.first());
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

                                            var buttoArray = [];
                                            var m = [];
                                            var embed = new Discord.MessageEmbed()
                                            var title = ""; 
                                            var image = "";
                                            
                                            var m = String(str[i]).split(delimiter);
                                            if (!m.length == 0){
                                                var image_state = !(m[0].startsWith("image.no"));
                                                if (image_state){
                                                    var image = m[0];
                                                    m.shift();
                                                } else {
                                                    m.shift();
                                                }
                                            }
                                            if (!m.length == 0){
                                                var title_state = m[0].startsWith("title.");
                                                if(title_state){
                                                    var title = m[0];
                                                    m.shift();
                                                }
                                            }
                                            
                                            var one_row = (!m.length == 0 && m.length/2 <= 5 && m.length % 2 == 0);
                                            var multiple_row = (!m.length == 0 && m[m.length-1].startsWith("columns.") && (m.length-1) % 2 == 0);

                                            if (one_row){
                                                for (var j = 1; j <= (m.length)/2; ++j) {
                                                    buttoArray[j] = new Discord.MessageButton()
                                                    .setLabel(m[j*2-2])
                                                    .setStyle('LINK')
                                                    .setURL(m[j*2-1])
                                                }
                                                var row = [new Discord.MessageActionRow()
                                                .addComponents(
                                                    buttoArray
                                                )];
                                            } else if (multiple_row) {
                                                var row = [];
                                                var columns = parseInt(m[m.length-1].slice(8));
                                                var row_amount = Math.ceil(((m.length-1)/2)/columns);

                                                var l = m.length-1;
                                                if (row_amount <= 5 && columns <= 5){

                                                    for (var k = 0; k < row_amount; ++k) {
                                                        var buttoArray = [];

                                                        for (var j = ((columns*2)*k); (j < ((columns*2)*k)+(columns*2)); j+=2) {
                                                            buttoArray.push(new Discord.MessageButton()
                                                                .setLabel(m[j])
                                                                .setStyle('LINK')
                                                                .setURL(m[j+1])
                                                            );
                                                            l -= 2;
                                                            if (l <= 0){
                                                                break
                                                            }
                                                        }

                                                        row[k] = new Discord.MessageActionRow()
                                                            .addComponents(
                                                                buttoArray
                                                            );
                                                    }
                                                } else {
                                                    return
                                                }
                                            }

                                            if (multiple_row || one_row) {
                                                if (image_state && title_state){
                                                    message.channel.send({
                                                        embeds : [embed
                                                            .setImage(image)
                                                            .setTitle(title.slice(6))
                                                            .setColor('#dc661f')
                                                            ],
                                                        components: row
                                                    })
                                                } else if (image_state) {
                                                    message.channel.send({
                                                        embeds : [embed
                                                            .setImage(image)
                                                            .setColor('#dc661f')
                                                            ],
                                                        components: row
                                                    })
                                                } else if (title_state) {
                                                    message.channel.send({
                                                        embeds : [embed
                                                            .setTitle(title.slice(6))
                                                            .setColor('#dc661f')
                                                            ],
                                                        components: row
                                                    })
                                                } else {
                                                    message.channel.send({
                                                        components: row
                                                    })
                                                }
                                            } else {
                                                if (image_state && title_state){
                                                    message.channel.send({
                                                        embeds : [embed
                                                            .setImage(image)
                                                            .setTitle(title.slice(6))
                                                            .setColor('#dc661f')
                                                            ]
                                                    })
                                                } else if (image_state) {
                                                    message.channel.send({
                                                        embeds : [embed
                                                            .setImage(image)
                                                            .setColor('#dc661f')
                                                            ]
                                                    })
                                                } else if (title_state) {
                                                    message.channel.send({
                                                        embeds : [embed
                                                            .setTitle(title.slice(6))
                                                            .setColor('#dc661f')
                                                            ]
                                                    })
                                                } else {
                                                    return
                                                }
                                            }

                                        } catch {
                                            console.error;
                                            return message.channel.send({embeds : [memberMessageEmbed
                                                .setTitle("Failed to read text file.")
                                                .setDescription("This message will be deleted in 10 seconds.")
                                                ]}).then(msg => {setTimeout(() => msg.delete(), 10000)})        
                                        }
                                    }
                                }
                            );
                            message.delete();
                            return;
                        } 
                    } else {
                        
                        var buttoArray = [];
                        var embed = new Discord.MessageEmbed();
                        const m = args.join(" ").split(delimiter);
                        var title = ""; 
                        var description_state = false;
                        if (!m.length == 0){
                            var title_state = m[0].startsWith("title.");
                            if (title_state){
                                var title = m[0];
                                m.shift();
                                if (title.length > 256){
                                    return message.channel.send({
                                        embeds : [embed
                                            .setTitle('Embed title exceeded 256 characters.')
                                            .setColor('#dc661f')
                                        ]
                                    }).then(msg => {setTimeout(() => msg.delete(), 10000)});
                                }
                            }
                        }
                        if (!m.length == 0){
                            var description_state = m[0].startsWith("description.");
                            if (description_state){
                                var description = m[0];
                                m.shift();
                                if (description.length > 4096){
                                    return message.channel.send({
                                        embeds : [embed
                                            .setTitle('Embed description exceeded 4096 characters.')
                                            .setColor('#dc661f')
                                        ]
                                    }).then(msg => {setTimeout(() => msg.delete(), 10000)});
                                }
                            }
                        }
                        const regex = /^(?:<:|<a:)(?<emojiName>\w+):(?<emojiID>\d+)>(?<buttonLabel>.+|)$/;

                        try {
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
                                console.log(buttoArray);
                                if (message.attachments.size === 1){
                                    if(description_state && title_state) {
                                        message.channel.send({
                                                    embeds : [embed
                                                        .setTitle(title.slice(6))
                                                        .setDescription(description.slice(12))
                                                        .setColor('#dc661f')
                                                        .setImage(message.attachments.first().url)
                                                        ],
                                                    components: [row]
                                                })
                                    } else if (title_state) {
                                        message.channel.send({
                                                    embeds : [embed
                                                        .setTitle(title.slice(6))
                                                        .setColor('#dc661f')
                                                        .setImage(message.attachments.first().url)
                                                        ],
                                                    components: [row]
                                                })
                                            
                                    } else {
                                        message.channel.send({
                                                    embeds : [embed
                                                        .setColor('#dc661f')
                                                        .setImage(message.attachments.first().url)
                                                        ],
                                                    components: [row]
                                                })
                                            
                                    }
                                        message.delete()
                                } else {
                                    if(description_state && title_state) {
                                        message.channel.send({
                                                    embeds : [embed
                                                        .setTitle(title.slice(6))
                                                        .setDescription(description.slice(12))
                                                        .setColor('#dc661f')
                                                        ],
                                                    components: [row]
                                                })
                                            
                                    } else if (title_state){
                                        console.log('destination');

                                        message.channel.send({
                                                embeds : [embed
                                                    .setTitle(title.slice(6))
                                                    .setColor('#dc661f')
                                                ],
                                                components: [row]
                                            })
                                        
                                    } else {
                                        message.channel.send({
                                                components: [row]
                                            })
                                        
                                    }
                                        message.delete()
                                }
                            } else {
                                if (message.attachments.size === 1){
                                    if(description_state && title_state) {
                                        message.channel.send({
                                                    embeds : [embed
                                                        .setTitle(title.slice(6))
                                                        .setDescription(description.slice(12))
                                                        .setColor('#dc661f')
                                                        .setImage(message.attachments.first().url)
                                                        ],
                                                    components: []
                                                }
                                                )
                                            
                                    } else if (title_state) {
                                        message.channel.send({
                                                    embeds : [embed
                                                        .setTitle(title.slice(6))
                                                        .setColor('#dc661f')
                                                        .setImage(message.attachments.first().url)
                                                        ],
                                                        components: []
                                                })
                                    } else {
                                        message.channel.send({
                                                    embeds : [embed
                                                        .setColor('#dc661f')
                                                        .setImage(message.attachments.first().url)
                                                        ],
                                                    components: []
        
                                                })
        
                                    }
                                        message.delete()
                                } else {
                                    if(description_state && title_state) {
                                        message.channel.send({
                                                    embeds : [embed
                                                        .setTitle(title.slice(6))
                                                        .setDescription(description.slice(12))
                                                        .setColor('#dc661f')
                                                        ],
                                                    components: []
                                                })
        
                                    } else if (title_state){
                                        message.channel.send({
                                                embeds : [embed
                                                    .setTitle(title.slice(6))
                                                    .setColor('#dc661f')
                                                ],
                                                components: []
                                            })
        
                                    } else if (description_state){
                                        message.channel.send({
                                                embeds : [embed
                                                    .setDescription(description.slice(12))
                                                    .setColor('#dc661f')
                                                ],
                                                components: []
                                            })
        
                                    }
                                    else {
                                        message.delete()
                                        return;
                                    }
                                    message.delete()
                                }
                                
                            }
                        } catch {
                            console.error;
                            message.delete();
                            message.channel.send({embeds : [embed
                                .setTitle("Not a valid argument.")
                                .setDescription("This message will be deleted in 10 seconds.")
                                ]}).then(msg => {setTimeout(() => msg.delete(), 10000)});
                        }
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
                    if (!args.length && !(message.attachments.size === 1)) return message.channel.send("There's no argument D:");
                    var buttoArray = [];
                    var embed = new Discord.MessageEmbed();
                    const m = args.join(" ").split(delimiter);

                    var title = ""; 
                    var channelID = m[0];
                    var messageID = m[1];
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
                        
                        if (message.attachments.size === 1){
                            if(description_state && title_state) {
                                client.channels.cache.get(channelID).messages.fetch(messageID)
                                    .then(msg => {
                                        var embed = msg.embeds[0];
                                        msg.edit({
                                            embeds : [embed
                                                .setTitle(title.slice(6))
                                                .setDescription(description.slice(12))
                                                .setColor('#dc661f')
                                                .setImage(message.attachments.first().url)
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
                                                .setImage(message.attachments.first().url)
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
                                                .setImage(message.attachments.first().url)
                                                ],
                                            components: [row]
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
                                                .setImage(message.attachments.first().url)
                                                ],
                                            components: [row]
                                        })

                                    }
                                    )
                            }
                                message.delete()
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
                            } else {
                                client.channels.cache.get(channelID).messages.fetch(messageID)
                                .then(msg =>
                                    msg.edit({
                                        components: [row]
                                    })
                                )
                            }
                            message.delete()
                        }
                    } else {
                        if (message.attachments.size === 1){
                            if(description_state && title_state) {
                                client.channels.cache.get(channelID).messages.fetch(messageID)
                                    .then(msg => 
                                        msg.edit({
                                            embeds : [embed
                                                .setTitle(title.slice(6))
                                                .setDescription(description.slice(12))
                                                .setColor('#dc661f')
                                                .setImage(message.attachments.first().url)
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
                                                .setImage(message.attachments.first().url)
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
                                                    .setImage(message.attachments.first().url)
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
                                                .setImage(message.attachments.first().url)
                                                ]

                                        })
                                    }
                                    )
                            }
                                message.delete()
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
                            message.delete()
                        }
                        
                    }
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

