const EmbedBuilder = require('../schemas/EmbedBuilder');

module.exports = {
    name: 'create',
    aliases: [],
    description: "This command will embed or return a button",
    async execute(message, args, cmd, client, Discord){
        console.log('Embedv2!');
        const EmbedBuilderUser = await client.createEmbedBuilder(message.guild,message.member);
        console.log(args);
        let title = client.titleDoko(args.join(" "))[0];

        let messages = EmbedBuilderUser.messages;
        let oneMessage = messages.find(o => o.name === title)
        if(oneMessage){
            console.log("The message title exists.")
        } else {
            messages.push({name: title});
            await EmbedBuilderUser.save();
        }
    }
}
