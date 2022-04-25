const request = require('request');
const delimiter = "|";
module.exports = {
    name: 'embed',
    aliases: [],
    description: "This command will embed or return a button",
    async execute(message, args, cmd, client, Discord){
        
        var embed = new Discord.MessageEmbed()
        
            if(cmd === 'embed'){
                try {
                    if (!args.length){
                        if(message.attachments.size === 1 && message.attachments.first().contentType.startsWith("text")){
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
                            return;
                        } 
                    } else {
                        
                        var buttoArray = [];
                        var embed = new Discord.MessageEmbed();
                        const m = args.join(" ").split(delimiter);
                    
                        var image = ""; 
                        var title = ""; 
                        var description_state = false;
                        var title_state = false;

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
                            }
                        }
                        if (message.attachments.size === 1 && message.attachments.first().contentType.startsWith("image")){
                            var image = message.attachments.first().url;
                        }
                        console.log(m.length);
                        if (!isValidURL(image)){
                            return channel.send({embeds : [embed
                                .setTitle("Not a valid image URL.")
                                .setDescription("This message will be deleted in 10 seconds.")
                                ]}).then(msg => {setTimeout(() => msg.delete(), 10000)});
                        }
                        var image_response = (message.attachments.size === 1 && message.attachments.first().contentType.startsWith("image")) || image_state;
                        
                        var one_row = (!m.length == 0 && m.length/2 <= 5 && m.length % 2 == 0);

                        const regex = /^(?:<:|<a:)(?<emojiName>\w+):(?<emojiID>\d+)>(?<buttonLabel>.+|)$/;
                        
                        if (!one_row) {
                            return channel.send({embeds : [embed
                                .setTitle("You excedeed the maximum of five buttons.")
                                .setDescription("This message will be deleted in 10 seconds.")
                                ]}).then(msg => {setTimeout(() => msg.delete(), 10000)});
                        }
                        
                        try {
                            message.delete()
                            if(!m.length == 0 && m.length/2 <= 5 && m.length % 2 == 0){
                                console.log(regex);

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
                                                .setTitle('|'+m[j]+'| button\'s label exceeded 80 characters.')
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
        
                                            return channel.send({
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
                                if (image_response){
                                    if(description_state && title_state) {
                                        console.log('1');
                                        return channel.send({
                                                    embeds : [embed
                                                        .setTitle(title.slice(6))
                                                        .setDescription(description.slice(12))
                                                        .setColor('#dc661f')
                                                        .setImage(image)
                                                        ],
                                                    components: [row]
                                                })
                                    } else if (title_state) {
                                        console.log('2');
                                        return channel.send({
                                                    embeds : [embed
                                                        .setTitle(title.slice(6))
                                                        .setColor('#dc661f')
                                                        .setImage(image)
                                                        ],
                                                    components: [row]
                                                })
                                            
                                    } else if (description_state) {
                                        console.log('3');
                                        return channel.send({
                                                    embeds : [embed
                                                        .setDescription(description.slice(12))
                                                        .setColor('#dc661f')
                                                        .setImage(image)
                                                        ],
                                                    components: [row]
                                                })
                                                        
                                    } else {
                                        
                                        return channel.send({
                                                    embeds : [embed
                                                        .setColor('#dc661f')
                                                        .setImage(image)
                                                        ],
                                                    components: [row]
                                                })
                                            
                                    }
                                } else {
                                    if(description_state && title_state) {
                                        
                                        return channel.send({
                                                    embeds : [embed
                                                        .setTitle(title.slice(6))
                                                        .setDescription(description.slice(12))
                                                        .setColor('#dc661f')
                                                        ],
                                                    components: [row]
                                                })
                                            
                                    } else if (title_state){
                                        console.log('destination');
                                        
                                        return channel.send({
                                                embeds : [embed
                                                    .setTitle(title.slice(6))
                                                    .setColor('#dc661f')
                                                ],
                                                components: [row]
                                            })
                                    } else if (description_state){
                                        console.log('destination');
                                        
                                        return channel.send({
                                                embeds : [embed
                                                    .setDescription(description.slice(12))
                                                    .setColor('#dc661f')
                                                ],
                                                components: [row]
                                            })
                                    } else {
                                        
                                        return channel.send({
                                                components: [row]
                                            })
                                        
                                    }
                                }
                            } else {
                                if (image_response){
                                    if(description_state && title_state) {
                                        
                                        return channel.send({
                                                    embeds : [embed
                                                        .setTitle(title.slice(6))
                                                        .setDescription(description.slice(12))
                                                        .setColor('#dc661f')
                                                        .setImage(image)
                                                        ],
                                                    components: []
                                                }
                                                )
                                            
                                    } else if (title_state) {
                                        
                                        return channel.send({
                                                    embeds : [embed
                                                        .setTitle(title.slice(6))
                                                        .setColor('#dc661f')
                                                        .setImage(image)
                                                        ],
                                                        components: []
                                                })
                                    } else if (description_state){
                                        
                                        return channel.send({
                                                embeds : [embed
                                                    .setDescription(description.slice(12))
                                                    .setColor('#dc661f')
                                                    .setImage(image)
                                                ],
                                                components: []
                                            })
                                    } else {
                                        
                                        return channel.send({
                                                    embeds : [embed
                                                        .setColor('#dc661f')
                                                        .setImage(image)
                                                        ],
                                                    components: []
        
                                                })
        
                                    }
                                } else {
                                    if(description_state && title_state) {
                                        
                                        return channel.send({
                                                    embeds : [embed
                                                        .setTitle(title.slice(6))
                                                        .setDescription(description.slice(12))
                                                        .setColor('#dc661f')
                                                        ],
                                                    components: []
                                                })
        
                                    } else if (title_state){
                                        
                                        return channel.send({
                                                embeds : [embed
                                                    .setTitle(title.slice(6))
                                                    .setColor('#dc661f')
                                                ],
                                                components: []
                                            })
        
                                    } else if (description_state){
                                        
                                        return channel.send({
                                                embeds : [embed
                                                    .setDescription(description.slice(12))
                                                    .setColor('#dc661f')
                                                ],
                                                components: []
                                            })
        
                                    }
                                    else {
                                        
                                        return;
                                    }
                                }
                                
                            }
                        } catch {
                            console.error;
                            
                            channel.send({embeds : [embed
                                .setTitle("Not a valid argument.")
                                .setDescription("This message will be deleted in 10 seconds.")
                                ]}).then(msg => {setTimeout(() => msg.delete(), 10000)});
                        }
                    }
                    
                } catch {
                    console.error;
                    
                    channel.send({embeds : [memberMessageEmbed
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