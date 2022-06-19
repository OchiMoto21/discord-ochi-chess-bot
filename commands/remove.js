const EmbedBuilder = require('../schemas/EmbedBuilder');

module.exports = {
    name: 'remove',
    aliases: [],
    description: "This command will embed or return a button",
    async execute(message, args, cmd, client, Discord){
        console.log('Embedv2!');
        const EmbedBuilderUser = await client.createEmbedBuilder(message.guild,message.member);
        if (args[0] == "all"){
            EmbedBuilderUser.messages = [];
            await EmbedBuilderUser.save().catch(err=> console.log(err));
            return;
        }

        let title = client.titleDoko(args.join(" "))[0];
        args = client.titleDoko(args.join(" "))[1];

        let messages = EmbedBuilderUser.messages;
        let oneMessage = messages.find(o => o["name"] === title);
        
        if(oneMessage && !(args.length == 0)){
            switch (args[0]){
                case "embed":
                    if (args.length > 1){
                        switch (args[1]){
                            case "image":
                                oneMessage[args[0]][args[1]] = null;
                                break;
                            case "field":
                                if (oneMessage[args[0]][args[1]].length >= parseInt(args[2]))
                                    oneMessage[args[0]][args[1]].splice(0,parseInt(args[2]-1))
                                break;
                            default:
                                oneMessage[args[0]][args[1]] = null;
                                break;
                        }
                    } else {
                        oneMessage[args[0]] = {
                            title: null,
                            color: null,
                            description:null,
                            field:[],
                            image:{
                                url: null
                            }
                        };
                    }
                    break;
                case "button":
                    if (oneMessage[args[0]].length >= parseInt(args[1]))
                        oneMessage[args[0]].splice(0,parseInt(args[1]-1))
                    break;
            }

        } else if (oneMessage){
            await oneMessage.remove();
        } else {
            console.log("message not found")
        }
        await EmbedBuilderUser.save().catch(err=> console.log(err));

    }
}