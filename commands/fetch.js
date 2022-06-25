module.exports = {
    name: 'fetch',
    aliases: [],
    description: "This command will give your forging result",
    async execute(message, args, cmd, client, Discord){
        var embed = new Discord.MessageEmbed()
        if(message.author.id=="656974081140326401"){
                if (args[0] == "message"){
                    if (!client.isValidURL(args[1])) return;
        
                    var id = args[1].split("/");
                    if(!(id[id.length-1].length == 18 && id[id.length-2].length == 18)) return;
                    
                    var chnl = await client.channels.fetch(id[id.length-2]);
                    var msg = await chnl.messages.fetch(id[id.length-1]);
                   
                    console.log(msg.embeds,!(message.author.bot));
                    if (msg.content.includes('<:kaelabonk:956580833374928937>') && !msg.author.bot){
                        var command = client.commands.get('kaelabonk');
                        command.execute(msg,'','kaelabonk',client,Discord).catch(err => {
                            console.log(err);
                            if (err instanceof Discord.HTTPError) {
                                setTimeout(() => command.execute(message, args, cmd, client, Discord), 10000)
                            }
                            return;
                        });
                    }
                    return;
                }
                if (Number.isInteger(parseInt(args[0]))){
                    const fetched_messages = await message.channel.messages.fetch({ limit: parseInt(args[0])+1 })
                    fetched_messages.forEach(async message => {
                        
                        console.log(message,!(message.author.bot));
                        if (message.content.includes('<:kaelabonk:956580833374928937>') && !message.author.bot){
                                    var command = client.commands.get('kaelabonk');
                                    command.execute(message,'','kaelabonk',client,Discord).catch(err => {
                                        console.log(err);
                                        if (err instanceof Discord.HTTPError) {
                                            setTimeout(() => command.execute(message, args, cmd, client, Discord), 10000)
                                        }
                                        return;
                                    });
                                }
                    });
                }
        }
    }
}
