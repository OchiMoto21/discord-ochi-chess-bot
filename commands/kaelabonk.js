module.exports = {
    name: 'kaelabonk',
    aliases: [],
    description: "This command will give your forging result",
    async execute(message, args, cmd, client, Discord){
        var embed = new Discord.MessageEmbed()
        var chance = getRandomInt(2)
        if(message.channel.id == "918356347605643290"){
            if (chance==1){
                return message.channel.send({embeds : [embed
                    .setImage('http://drive.google.com/uc?export=view&id=1dbdS2pWIGWIob1jU84Rf4AMuUC1Si56f')
                    .setTitle("Forging succeed!")
                ]})
            }
            if (chance==0){
                return message.channel.send({embeds : [embed
                    .setImage('http://drive.google.com/uc?export=view&id=1exSrTK0XEEVNzrvL87IgRMTA9Qd0K5EP')
                    .setTitle("Forging Failed D:")
                ]})
            }
        }
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
