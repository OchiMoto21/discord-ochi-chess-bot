module.exports = {
    name: 'add',
    aliases: [],
    description: "This command will add an embed or button to a created message",
    async execute(message, args, cmd, client, Discord){
        console.log('Embedv2! add');

        const EmbedBuilderUser = await client.createEmbedBuilder(message.guild,message.author);
        
        let title = client.titleDoko(args.join(" "))[0];
        console.log(title);

        args = client.titleDoko(args.join(" "))[1];
        let m = args;
        let messages = EmbedBuilderUser.messages;
        
        let oneMessage = messages.find(o => o["name"] === title);
        if(oneMessage){
            console.log(m);
            switch (args[0]){
                case "embed":
                    switch (args[1]){
                        case "image":
                            if (client.isValidURL(m.slice(2).join(" ").trim())) 
                                oneMessage[args[0]][args[1]]["url"] = m.slice(2).join(" ").trim();
                            break;
                        case "field":
                            oneMessage[args[0]][args[1]].push(JSON.parse(m.slice(2).join(" ")));
                            break;
                        case "color":
                            if (Number.isInteger(parseInt(m.slice(2).join(" ")))) {oneMessage[args[0]][args[1]] = parseInt(m.slice(2).join(" ")).toString(16); break;}
                            if (args[2].match(/^#(?:[0-9a-fA-F]{3}){1,2}$/g) !== null) {oneMessage[args[0]][args[1]] = m.slice(2).join(" "); break;}
                        case "author":
                        case "footer":
                            if (args[2]=="icon_url" || args[2]=="url") {
                                    if (!client.isValidURL(m.slice(3).join(" ").trim())) return;
                                }
                            oneMessage[args[0]][args[1]][args[2]] = m.slice(3).join(" ");
                            break;
                        case "timestamp":
                            oneMessage[args[0]][args[1]] = new Date.now();
                            break;
                        default:
                            console.log(oneMessage[args[0]][args[1]],m.slice(2).join(" "));
                            oneMessage[args[0]][args[1]] = m.slice(2).join(" ");
                            break;
                    }
                    break;
                case "button":
                    oneMessage[args[0]].push(JSON.parse(m.slice(1).join(" ")));
                    break;
            }
            await EmbedBuilderUser.save();
        } else {
            console.log("message not found")
        }
    }
}