const request = require('request');
const delimiter = "|";
module.exports = {
    name: 'embed',
    aliases: [],
    description: "This command will embed or return a button",
    async execute(message, args, cmd, client, Discord){
        
        var errornotif = new Discord.MessageEmbed()
        if(message.channel.id == "825593098187833344"){
        
            if(cmd === 'embed'){
                if (!args.length && message.attachments.size === 1 && message.attachments.first().contentType.startsWith("text")){
                    request(message.attachments.first().url, 
                        function (error, response, body) {
                            const str = body.trim().replace(/(\r\n|\n|\r)/gm, "\n").split("\n");
                            for(var i = 0; i < parseInt(str.length); ++i){
                                    var m = String(str[i]).split(" ");
                                    var command = client.commands.get('embed');
                                    console.log(m);
                                    command.execute(message,m,'embed',client,Discord);

                            }
                        }
                    );
                } else {
                    
                    var buttoArray = [];
                    var embed = new Discord.MessageEmbed();
                    var errornotif = new Discord.MessageEmbed();

                    const m = args.join(" ").split(delimiter);
                
                    var image = ""; 
                    var title = ""; 
                    var description_state = false;
                    var title_state = false;
                    var embed_state = false;
                    var channel = message.channel;

                    while (!m.length == 0 && (m[0].startsWith("title.")||m[0].startsWith("image.")||m[0].startsWith("color.")||m[0].startsWith("description."))){
                        var embed_state = true
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
                    
                    if (message.attachments.size === 1 && message.attachments.first().contentType.startsWith("image")){
                        var image = message.attachments.first().url;
                        if (!isValidURL(image)){
                            return channel.send({embeds : [errornotif
                                .setTitle("Not a valid image URL.")
                                .setDescription("This message will be deleted in 10 seconds.")
                                ]}).then(msg => {setTimeout(() => msg.delete(), 10000)});
                        }
                        embed.setImage(image)
                    }
                    console.log(m.length);
                    
                    var one_row = (!m.length == 0 && m.length/2 <= 5 && m.length % 2 == 0);

                    const regex = /^(?:<:|<a:)(?<emojiName>\w+):(?<emojiID>\d+)>(?<buttonLabel>.+|)$/;
                    
                    if (!one_row && !m.length == 0) {
                        return channel.send({embeds : [errornotif
                            .setTitle("Invalid buttons argument.")
                            .setDescription("This message will be deleted in 10 seconds.")
                            ]}).then(msg => {setTimeout(() => msg.delete(), 10000)});
                    }
                    
                    
                    if(one_row){
                        console.log(regex);
                        for (var j = 0; j < (m.length); j += 2) {
                            if (!isValidURL(m[j+1].trim())){
                                return channel.send({embeds : [errornotif
                                    .setTitle("Not a valid button URL.")
                                    .setDescription("This message will be deleted in 10 seconds.")
                                    ]}).then(msg => {setTimeout(() => msg.delete(), 10000)});
                            }
                            if (m[j].length > 80 && !(regex.test(m[j]))){
                                return channel.send({
                                    embeds : [errornotif
                                        .setTitle('|'+m[j]+'| button\'s label exceeded 80 characters.')
                                        .setColor('#dc661f')
                                    ]
                                }).then(msg => {setTimeout(() => msg.delete(), 10000)});
                            }  
                            if (regex.test(m[j])){
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
                                        embeds : [errornotif
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
                        if (embed_state){
                            return channel.send({
                                embeds : [embed],
                                components: [row]
                            
                            })
                        }
                        return channel.send({
                                    components: [row]
                                })
                    } else {
                        return channel.send({
                            embeds : [embed],
                            components: []
                        })
                    }
                }
            }
        }
    }    
}
function isValidURL(string) {
    var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return (res !== null)
};