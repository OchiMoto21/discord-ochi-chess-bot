const KaelaBonkLevel = require('../schemas/KaelaBonkLevel')

module.exports = {
    name: 'kaelabonk',
    aliases: [],
    description: "This command will give your forging result",
    async execute(message, args, cmd, client, Discord){
        var embed = new Discord.MessageEmbed()
        if(message.channel.id == "825593098187833344"||message.channel.id=="966341480186789918"|| message.channel.id=="918356347605643290"){
            console.log("Testing KaelaBonk")
            const KaelaBonkLevelPlayer = await client.createBonkLevel(message.member);
            console.log(KaelaBonkLevelPlayer)
            var condition = ["succeed","failed"];
            if (KaelaBonkLevelPlayer.level == 0){
                var failed_prob = 50
            } else {
                var failed_prob = 50 + KaelaBonkLevelPlayer.level
            }
            
            var succeed_prob = 50
            console.log(succeed_prob,failed_prob)
            
            var likelihoods = [succeed_prob,failed_prob];
            var result = condition[simulateEvent(likelihoods)];
            console.log(result)
            
            var upgradeBonkCount = upgrade_bonk_count(KaelaBonkLevelPlayer.level)
            var upgrade = (KaelaBonkLevelPlayer.bonk_count >= upgradeBonkCount)
    
            if(upgrade){
                // You have reach the amount of bonk for an upgrade!
                // An upgrade have been successfully made <a:kaelayaay:957292452660772914>
                if (result =="succeed"){
                    console.log("11")
                    await KaelaBonkLevel.findOneAndUpdate({_id:KaelaBonkLevelPlayer._id},{bonk_count: KaelaBonkLevelPlayer.bonk_count += 1, level:  KaelaBonkLevelPlayer.level += 1})
                    return message.channel.send({embeds : [embed
                        .setImage('http://drive.google.com/uc?export=view&id=1dbdS2pWIGWIob1jU84Rf4AMuUC1Si56f')
                        .setTitle(`${message.author.tag}\nForging succeed!`)
                        .setDescription("You have reach the amount of successful bonk for an upgrade!\n") 
                        .addFields(
                            { name :"Upgrade succeed", value: `<a:kaelayaay:957292452660772914> level ${KaelaBonkLevelPlayer.level-1} ▶️ ${KaelaBonkLevelPlayer.level}`, inline: true},
                            { name :"Bonk count", value: `<:kaelanoted:961838924379062302> ${KaelaBonkLevelPlayer.bonk_count} bonk(s)`,inline: true},
                            { name :"Bonk needed for upgrade", value: `<a:kaelanumahammer:962582163251949578> ${bonkRequired(KaelaBonkLevelPlayer.level,KaelaBonkLevelPlayer.bonk_count)} bonk(s)`},
                        )
                        .setThumbnail(message.author.avatarURL())
                    ]})
                }
                // You have reach the amount of bonk for an upgrade!
                // Unfortunately, your upgrade failed
                if (result =="failed"){
                    console.log("10")
                    return message.channel.send({embeds : [embed
                        .setImage('http://drive.google.com/uc?export=view&id=1exSrTK0XEEVNzrvL87IgRMTA9Qd0K5EP')
                        .setTitle(`${message.author.tag}\nForging Failed D:`)
                        .setDescription("You have reach the amount of bonk for an upgrade!\nUnfortunately, your upgrade failed <:kaelasob:956587823673274389>")
                        .addFields(
                            { name :"Your level", value: `<a:elanguinsway:967462309276573727> level ${KaelaBonkLevelPlayer.level}`,inline: true},
                            { name :"Bonk count ", value: `<:kaelanoted:961838924379062302> ${KaelaBonkLevelPlayer.bonk_count} bonk(s)`, inline: true},
                            { name :"Bonk needed for upgrade", value: `<a:kaelanumahammer:962582163251949578> ${bonkRequired(KaelaBonkLevelPlayer.level,KaelaBonkLevelPlayer.bonk_count)} bonk(s)`},
                        )
                        .setThumbnail(message.author.avatarURL())
                    ]})
                }
            } else {
                if (result =="succeed"){
                    console.log("01")
                    await KaelaBonkLevel.findOneAndUpdate({_id:KaelaBonkLevelPlayer._id},{bonk_count: KaelaBonkLevelPlayer.bonk_count +=1})
                    return message.channel.send({embeds : [embed
                        .setImage('http://drive.google.com/uc?export=view&id=1dbdS2pWIGWIob1jU84Rf4AMuUC1Si56f')
                        .setTitle(`${message.author.tag}\nForging succeed!`)
                        .addFields(
                            { name :"Your level", value: `<a:elanguinsway:967462309276573727> level ${KaelaBonkLevelPlayer.level}`,inline: true},
                            { name :"Bonk count ", value: `<:kaelanoted:961838924379062302> ${KaelaBonkLevelPlayer.bonk_count} bonk(s)`,inline: true},
                            { name :"Bonk needed for upgrade", value: `<a:kaelanumahammer:962582163251949578> ${bonkRequired(KaelaBonkLevelPlayer.level,KaelaBonkLevelPlayer.bonk_count)} bonk(s)`},
                        )
                        .setThumbnail(message.author.avatarURL())
                    ]})
                }
                if (result =="failed"){
                    console.log("00")
                    return message.channel.send({embeds : [embed
                        .setImage('http://drive.google.com/uc?export=view&id=1exSrTK0XEEVNzrvL87IgRMTA9Qd0K5EP')
                        .setTitle(`${message.author.tag}\nForging Failed D:`)
                        .addFields(
                            { name :"Your level", value: `<a:elanguinsway:967462309276573727> level ${KaelaBonkLevelPlayer.level}`,inline: true},
                            { name :"Bonk count", value: `<:kaelanoted:961838924379062302> ${KaelaBonkLevelPlayer.bonk_count} bonk(s)`,inline: true},
                            { name :"Bonk needed for upgrade", value: `<a:kaelanumahammer:962582163251949578> ${bonkRequired(KaelaBonkLevelPlayer.level,KaelaBonkLevelPlayer.bonk_count)} bonk(s)`},
                        )
                        .setThumbnail(message.author.avatarURL())
                    ]})
                }
            }
        }
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
function bonkRequired(level, bonk_count) {
    return (upgrade_bonk_count(level)-bonk_count)+1
}
// https://riptutorial.com/javascript/example/10972/simulating-events-with-different-probabilities
function simulateEvent(chances) {
    var sum = 0;
    chances.forEach(function(chance) {
        sum+=chance;
    });
    var rand = Math.random();
    var chance = 0;
    for(var i=0; i<chances.length; i++) {
        chance+=chances[i]/sum;
        if(rand<chance) {
            return i;
        }
    }
    
    // should never be reached unless sum of probabilities is less than 1
    // due to all being zero or some being negative probabilities
    return -1;
}

function upgrade_bonk_count(level){
    return (level/2)*(2+(level-1))
}