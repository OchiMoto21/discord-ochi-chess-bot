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
        
        var arg = "";
        console.log(arg);
        var add = client.commands.get('add');
        for (var j = 0;j < msg.embeds.length; j++){
            for (const property in msg.embeds[j]) {
                if (msg.embeds[0][property] == null) continue;
                if (!["title","color","description","field","image","footer"].includes(`${property}`)) continue;
                switch (`${property}`){
                    case "image":
                        arg = ["\""+title+"\"", "embed",`${property}`, msg.embeds[0][property]["url"]].join(" ").split(" ");
                        await add.execute(message,arg,'add',client,Discord);
                        break;
                    case "field":
                        for (var i = 0;i < msg.embeds[0][property].length; i++){
                            arg = ["\""+title+"\"", "embed",`${property}`, JSON.stringify(msg.embeds[0][property][i])].join(" ").split(" ");
                            await add.execute(message,arg,'add',client,Discord);
                        }
                        break;
                    case "color":
                        arg = ["\""+title+"\"", "embed",`${property}`, msg.embeds[0][property]].join(" ").split(" ");
                        break;
                    case "footer":
                        for (const field_property in msg.embeds[0][property]){
                            arg = ["\""+title+"\"", "embed",`${property}`, `${field_property}`,JSON.stringify(msg.embeds[0][property][field_property])].join(" ").split(" ");
                            await add.execute(message,arg,'add',client,Discord);
                        }
                        break;
                    default:
                        arg = ["\""+title+"\"", "embed",`${property}`, msg.embeds[0][property]].join(" ").split(" ");
                        await add.execute(message,arg,'add',client,Discord);
                        break;
                }
            }
        }
        for (var j = 0;j < msg.components.length; j++){
            for (var i = 0; i< msg.components[j].components.length;i++) {
                if (!msg.components[j].components[i].style == 'LINK') return;
                arg = ["\""+title+"\"", "button","{label:"+ msg.components[j].components[i].label+",url:"+msg.components[j].components[i].url+"}"].join(" ").split(" ");
                await add.execute(message,arg,'add',client,Discord);
                break;
            }
        }
        
    }
}

function arraytoData(field,array) {
    
}
