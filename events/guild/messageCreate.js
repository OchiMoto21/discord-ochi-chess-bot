
module.exports = async (Discord, client, message) => {

    if (message.author.bot) return;
    await PassCheck(Discord, client, message).catch(err => console.log(err));
    
    if (message.content.includes('<:kaelabonk:956580833374928937>')||message.content.includes('🔨')){
        const command = client.commands.get("kaelabonk");
        const cmd = "";
        const args = "";
        await command.execute(message, args, cmd, client, Discord).catch(err => {
            console.log(err);
            return;
        });
    } 
    
    const prefix = '&';
    if(!message.content.startsWith(prefix)) return;
    
    const args = message.content.slice(prefix.length).split(/ +/);
    const cmd = args.shift().toLowerCase();

    const command = client.commands.get(cmd) || client.commands.find(a => a.aliases && a.aliases.includes(cmd))

    if(command) await command.execute(message, args, cmd, client, Discord)
        .catch(err => {
            console.log(err);
            return;
        });
    
    
}

const PassCheck = async (Discord, client, message) => {
    const member = await message.guild.members.fetch(message.author.id);
    const Member = await client.createMemberJoined(member);
    if (Member["Passed"]){
        return;
    } else {
        Member["Passed"] = true;
        Member.save().catch(err => console.log(err));
        return;
    }
}
