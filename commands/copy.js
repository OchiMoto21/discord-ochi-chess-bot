module.exports = {
    name: 'copy',
    aliases: [],
    description: "This command will give your forging result",
    async execute(message, args, cmd, client, Discord){
        let title = client.titleDoko(args.join(" "))[0];
        args = client.titleDoko(args.join(" "))[1];
        if (!client.isValidURL(args[0])) return;
        
        var id = args[0].split("/");
        if(!(id[id.length-1].length == 18 && id[id.length-2].length == 18)) return;
        
        var chnl = await client.channels.fetch(id[id.length-2]).catch(err=> console.log(err));
        var msg = await chnl.messages.fetch(id[id.length-1]).catch(err=> console.log(err));
        console.log(msg);
        var create = client.commands.get('create');
        await create.execute(message,["\""+title+"\""],'create',client,Discord);
        
        var arg = ["\""+title+"\"", "embed", "description", msg.content].join(" ").split(" ");
        console.log(arg);
        var add = client.commands.get('add');
        await add.execute(message,arg,'add',client,Discord);
        }
}