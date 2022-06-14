const delimiter = "|";
const request = require('request');

module.exports = {
    name: 'edit',
    aliases: [],
    description: "This command will embed or return a button",
    async execute(message, args, cmd, client, Discord){
        
        var errornotif = new Discord.MessageEmbed()
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
                    const m = args.join(" ").split(delimiter).map(Function.prototype.call, String.prototype.trim).filter(e =>  e);

                    var channelID = m[0];
                    var messageID = m[1];
                    m.shift();
                    m.shift();
                    var channel = message.channel;
                    var chnl = await client.channels.fetch(channelID)
                    var msg = await chnl.messages.fetch(messageID)

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
                            var embed_state = true
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
                            var embed_state = true
                        } 
                    
                        if(color_state){
                            if (!(m[0].slice(6).match(/^#(?:[0-9a-fA-F]{3}){1,2}$/g) !== null)){
                                return channel.send({embeds : [errornotif
                                    .setTitle("Not a valid hex color.")
                                    .setDescription("This message will be deleted in 10 seconds.")
                                    ]}).then(msg => {setTimeout(() => msg.delete(), 10000)});
                            }
                            var color = m[0];
                            console.log("color set")
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
                            var embed_state = true
                        }
                    }


                    var one_row = (!m.length == 0 && m.length/2 <= 5 && m.length % 2 == 0);
                    var multiple_row = (!m.length == 0 && m[m.length-1].startsWith("columns.") && (m.length-1) % 2 == 0);

                    const regex = /^(?:<:|<a:)(?<emojiName>\w+):(?<emojiID>\d+)>(?<buttonLabel>.+|)$/;
                    
                    if (!one_row && !m.length == 0) {
                        return channel.send({embeds : [embed
                            .setTitle("Invalid buttons argument.")
                            .setDescription("This message will be deleted in 10 seconds.")
                            ]}).then(msg => {setTimeout(() => msg.delete(), 10000)});
                    };
                    console.log(m.length);

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
                    
                    if ((multiple_row || one_row) && (embed_state)) {
                            msg.edit({
                                embeds : [embed],
                                components: row
                        })
                    } else if (multiple_row || one_row){
                            msg.edit({
                                components: row
                        })
                    } else {
                            msg.edit({
                                embeds : [embed]
                        })
                    }
                    
                }
        }
        
    }
}

function isValidURL(string) {
    var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return (res !== null)
};