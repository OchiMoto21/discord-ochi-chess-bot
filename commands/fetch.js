module.exports = {
    name: 'fetch',
    aliases: [],
    description: "This command will give your forging result",
    async execute(message, args, cmd, client, Discord){
        var embed = new Discord.MessageEmbed()
        if(message.author.id=="656974081140326401"){
            try {
                const fetched_messages = await message.channel.messages.fetch({ limit: parseInt(args[0])+1 })
                for (let [key, value] of fetched_messages) {
                    console.log(value,!(value.author.bot));
                    if (value.content.includes('<:kaelabonk:956580833374928937>') && !value.author.bot){
                                var command = client.commands.get('kaelabonk');
                                command.execute(value,'','kaelabonk',client,Discord);
                            }
            
                }
                    
                // messages.forEach(message => {
                //     if (message.content.includes('<:kaelabonk:956580833374928937>') && !message.author.bot){
                //         var command = client.commands.get('kaelabonk');
                //         command.execute(message,'','kaelabonk',client,Discord);
                //     }
    
                // });
            }
            catch {
                console.error
            }
        }
    }
}
