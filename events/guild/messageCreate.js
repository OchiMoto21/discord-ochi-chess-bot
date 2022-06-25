
module.exports = (Discord, client, message) => {
    const prefix = '&';
    if(message.content.includes('<:kaelabonk:956580833374928937>') && !message.author.bot){
        const command = client.commands.get("kaelabonk");
        const cmd = "";
        const args = "";
        command.execute(message, args, cmd, client, Discord).catch(err => {
            console.log(err);
            return;
        });
    } 

    if(!message.content.startsWith(prefix) || message.author.bot) return;
    
    const args = message.content.slice(prefix.length).split(/ +/);
    const cmd = args.shift().toLowerCase();

    const command = client.commands.get(cmd) || client.commands.find(a => a.aliases && a.aliases.includes(cmd))

    if(command) command.execute(message, args, cmd, client, Discord)
        .catch(err => {
            console.log(err);
            return;
        });
}
