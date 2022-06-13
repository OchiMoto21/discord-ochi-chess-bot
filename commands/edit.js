const delimiter = "|";
const request = require('request');

module.exports = {
    name: 'edit',
    aliases: [],
    description: "This command will embed or return a button",
    async execute(message, args, cmd, client, Discord){
        
        var errornotif = new Discord.MessageEmbed()
        if(message.channel.id == "825593098187833344"||message.channel.id == "966341480186789918"){
            if(cmd === 'edit'){

                    if (!args.length && !(message.attachments.size === 1)) return channel.send("There's no argument D:");
                    if (!args.length && message.attachments.size === 1 && message.attachments.first().contentType.startsWith("text")){
                        request(message.attachments.first().url, 
                            function (error, response, body) {
                                const str = body.trim().replace(/(\r\n|\n|\r)/gm, "\n").split("\n");
                                var channel = message.channel;
                                for(var i = 0; i < parseInt(str.length); ++i){
                                    var m = [];
                                    var m = String(str[i]).split(" ");
                                    var command = client.commands.get('edit');
                                    console.log(m);
                                    command.execute(message,m,'edit',client,Discord);
                                    
                                }
                            }
                        );
                    } else {
                        var buttoArray = [];
                        const m = args.join(" ").split(delimiter);
    
                        var channelID = m[0];
                        var messageID = m[1];
                        m.shift();
                        m.shift();
                        var channel = message.channel;
                        var chnl = await client.channels.fetch(channelID)
                        console.log(channelID)
                        var msg = await chnl.messages.fetch(messageID)
                        //    .then(msg => {
                            var embed = msg.embeds[0];
                            while (!m.length == 0 && (m[0].startsWith("title.")||m[0].startsWith("image.")||m[0].startsWith("color.")||m[0].startsWith("description."))){
                                        
                                var title_state = m[0].startsWith("title.");
                                var image_state = m[0].startsWith("image.");
                                var color_state = m[0].startsWith("color.")
                                var description_state = m[0].startsWith("description.");
        
                                if(title_state){
                                    var title = m[0];
                                    m.shift();
                                    if (title.length > (256+6)){
                                        return channel.send({
                                            embeds : [errornotif
                                                .setTitle('Embed title exceeded 256 characters.')
                                                .setColor('#dc661f')
                                            ]
                                        }).then(msg => {setTimeout(() => msg.delete(), 10000)});
                                    }
                                    embed.setTitle(title.slice(6))
                                }
                            
                                if (image_state){
                                    var image = m[0].trim().slice(6);
                                    m.shift();
                                    if (!isValidURL(image)){
                                        return channel.send({embeds : [errornotif
                                            .setTitle("Not a valid image URL.")
                                            .setDescription("This message will be deleted in 10 seconds.")
                                            ]}).then(msg => {setTimeout(() => msg.delete(), 10000)});
                                    }
                                    embed.setImage(image)
                                } 
                            
                                if(color_state){
                                    if (!(m[0].slice(6).match(/^#(?:[0-9a-fA-F]{3}){1,2}$/g) !== null)){
                                        return channel.send({embeds : [errornotif
                                            .setTitle("Not a valid hex color.")
                                            .setDescription("This message will be deleted in 10 seconds.")
                                            ]}).then(msg => {setTimeout(() => msg.delete(), 10000)});
                                    }
                                    var color = m[0];
                                    embed.setColor(color.slice(6))
                                    m.shift();
                                }
        
                                if (description_state){
                                    var description = m[0].slice(12);
                                    if (description.length > 4096){
                                        return channel.send({
                                            embeds : [errornotif
                                                .setTitle('Embed description exceeded 4096 characters.')
                                                .setColor('#dc661f')
                                            ]
                                        }).then(msg => {setTimeout(() => msg.delete(), 10000)});
                                    }
                                    embed.setDescription(description)
                                    m.shift();
                                }
                            }
    
                            var one_row = (!m.length == 0 && m.length/2 <= 5 && m.length % 2 == 0);
    
                            const regex = /^(?:<:|<a:)(?<emojiName>\w+):(?<emojiID>\d+)>(?<buttonLabel>.+|)$/;
                            
                            if (!one_row && !m.length == 0) {
                                return channel.send({embeds : [embed
                                    .setTitle("Invalid buttons argument.")
                                    .setDescription("This message will be deleted in 10 seconds.")
                                    ]}).then(msg => {setTimeout(() => msg.delete(), 10000)});
                            };
                            console.log(m.length);
    
                            if(one_row){
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
                                msg.edit({
                                    embeds : [embed],
                                    components: [row]
                                })
    
                            } else {
                                msg.edit({
                                    embeds : [embed]
                                })
                            }
                        //})
                    }
            }
        }
    }
}

function isValidURL(string) {
    var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return (res !== null)
};