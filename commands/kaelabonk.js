const KaelaBonkLevel = require('../schemas/KaelaBonkLevel')

module.exports = {
    name: 'kaelabonk',
    aliases: [],
    description: "This command will give your forging result",
    async execute(message, args, cmd, client, Discord){
        var embed = new Discord.MessageEmbed()
        if(message.channel.id=="966341480186789918" || message.channel.id=="918356347605643290" || message.channel.id=="1145499523590934608"){
            
            // Set up the embed message
            var Embed = {
                color: `#e67e22`,
                author: {
                    name:`${message.author.tag}`,
                    icon_url:message.author.avatarURL(),
                },
                thumbnail: {
                    url:null
                },
                image: {
                    url: null
                },
                footer: {
                    text: null,
                },
            
            }
            if (message.author.discriminator == '0') {Embed.author.name = `${message.author.username}`};

            // Start
            console.log("Testing KaelaBonk")
            
            // Take the player's database
            const KaelaBonkLevelPlayer = await client.createBonkLevel(message.author);
            console.log(KaelaBonkLevelPlayer)

            // Convert to unix timestamp https://stackoverflow.com/questions/46237707/node-js-converting-date-string-to-unix-timestamp
            var createdAtUnix = Math.floor(message.createdAt.getTime()/1000);
            if (KaelaBonkLevelPlayer.createdTimestamp !== null) {var lastBonkTimeUnix = Math.floor(KaelaBonkLevelPlayer.createdTimestamp.getTime()/1000)};
            // Check the cooldown time
            if (KaelaBonkLevelPlayer.createdTimestamp !== null) {
                var timeDifference = message.createdAt.getTime() - KaelaBonkLevelPlayer.createdTimestamp.getTime();
                
                if ( timeDifference < 60*30*1000) {
                    var NextBonkTime = lastBonkTimeUnix + 60*30;    
                    Embed.author = null;
                    Embed.description = `**${message.author.username}** next bonk is <t:${NextBonkTime}:R> <a:elanguinsway:967462309276573727>`;
                    await message.channel.send({
                        embeds : [Embed]
                        })
                    return;
                }
            } 
            
            // Determine the success probability
            if (KaelaBonkLevelPlayer.level <= 25){
                var succeed_prob = 0.8;
            } else if (KaelaBonkLevelPlayer.level >= 26 && KaelaBonkLevelPlayer.level <= 50){
                var succeed_prob = 0.6;
            } else if (KaelaBonkLevelPlayer.level >= 51 && KaelaBonkLevelPlayer.level <= 75){
                var succeed_prob = 0.3;
            } else if (KaelaBonkLevelPlayer.level >= 76 && KaelaBonkLevelPlayer.level <= 100){
                var succeed_prob = 0.1;
            } else if (KaelaBonkLevelPlayer.level >= 101){
                var succeed_prob = 0.05;
            }

            // Determine the fail probability
            var failed_prob = 1 - succeed_prob;
            console.log(succeed_prob,failed_prob)
            
            // Determine success and fail
            var condition = ["succeed","failed"];
            var likelihoods = [succeed_prob,failed_prob];
            var result = condition[simulateEvent(likelihoods)];
            console.log(result)
            
            // Determine if the player got an upgrade or not
            var upgradeBonkCount = upgrade_bonk_count(KaelaBonkLevelPlayer.level);
            var upgrade = (KaelaBonkLevelPlayer.bonk_count >= upgradeBonkCount);
            Embed.footer = {
                text:`Success chance ${succeed_prob*100}%`
            }

            
            if(upgrade){
                // You have reach the amount of bonk for an upgrade!
                // An upgrade have been successfully made <a:kaelayaay:957292452660772914>
                if (result =="succeed"){
                    console.log("11")
                    await KaelaBonkLevel.findOneAndUpdate({_id:KaelaBonkLevelPlayer._id},{bonk_count: KaelaBonkLevelPlayer.bonk_count += 1, level:  KaelaBonkLevelPlayer.level += 1, createdTimestamp: message.createdAt})
                    Embed.title = "Forging succeed!";
                    Embed.description = "You have reach the amount of successful bonk for an upgrade!";
                    Embed.fields = [
                        { name :"Upgrade succeed", value: `<a:kaelayaay:957292452660772914> level ${KaelaBonkLevelPlayer.level-1} ▶️ ${KaelaBonkLevelPlayer.level}`, inline: true},
                        { name :"Bonk count", value: `<:kaelanoted:961838924379062302> ${KaelaBonkLevelPlayer.bonk_count} bonk(s)`,inline: true},
                        { name :"Next bonk", value: `<t:${createdAtUnix+60*30}:R>`,inline: true},
                        { name :"Bonk needed for upgrade", value: `<a:kaelanumahammer:962582163251949578> ${bonkRequired(KaelaBonkLevelPlayer.level,KaelaBonkLevelPlayer.bonk_count)} bonk(s)`}
                    ];
                    Embed.image.url = `https://cdn.discordapp.com/attachments/1006146433247891566/1061309084982325318/smithing_success.png`;
                    await message.channel.send({embeds : [Embed]}).catch(err => {
                        console.log(err);
                        if (err instanceof Discord.HTTPError) {
                            setTimeout(() => message.channel.send({embeds : [Embed]}), 10000)
                        }
                        return;
                    });
                    return;
                }
                // You have reach the amount of bonk for an upgrade!
                // Unfortunately, your upgrade failed
                if (result =="failed"){
                    console.log("10")
                    await KaelaBonkLevel.findOneAndUpdate({_id:KaelaBonkLevelPlayer._id},{createdTimestamp: message.createdAt})
                    Embed.title = "Forging Failed D:";
                    Embed.description = "You have reach the amount of bonk for an upgrade!\nUnfortunately, your upgrade failed <:kaelasob:956587823673274389>";
                    Embed.fields = [
                        { name :"Your level", value: `<a:elanguinsway:967462309276573727> level ${KaelaBonkLevelPlayer.level}`,inline: true},
                        { name :"Bonk count ", value: `<:kaelanoted:961838924379062302> ${KaelaBonkLevelPlayer.bonk_count} bonk(s)`, inline: true},
                        { name :"Next bonk", value: `<t:${createdAtUnix+60*30}:R>`,inline: true},
                        { name :"Bonk needed for upgrade", value: `<a:kaelanumahammer:962582163251949578> ${bonkRequired(KaelaBonkLevelPlayer.level,KaelaBonkLevelPlayer.bonk_count)} bonk(s)`},
                    ];
                    Embed.thumbnail.url = 'https://cdn.discordapp.com/attachments/1006146433247891566/1061309084458029256/smithing_fail.png';
                    await message.channel.send({embeds : [Embed]}).catch(err => {
                        console.log(err);
                        if (err instanceof Discord.HTTPError) {
                            setTimeout(() => message.channel.send({embeds : [Embed]}), 10000)
                        }
                        return;
                    });
                    return;
                }
            } else {
                if (result =="succeed"){
                    console.log("01")
                    await KaelaBonkLevel.findOneAndUpdate({_id:KaelaBonkLevelPlayer._id},{bonk_count: KaelaBonkLevelPlayer.bonk_count +=1,createdTimestamp: message.createdAt})
                    Embed.title = "Forging succeed!";
                    Embed.fields = [
                        { name :"Your level", value: `<a:elanguinsway:967462309276573727> level ${KaelaBonkLevelPlayer.level}`,inline: true},
                        { name :"Bonk count ", value: `<:kaelanoted:961838924379062302> ${KaelaBonkLevelPlayer.bonk_count} bonk(s)`,inline: true},
                        { name :"Next bonk", value: `<t:${createdAtUnix+60*30}:R>`,inline: true},
                        { name :"Bonk needed for upgrade", value: `<a:kaelanumahammer:962582163251949578> ${bonkRequired(KaelaBonkLevelPlayer.level,KaelaBonkLevelPlayer.bonk_count)} bonk(s)`},
                    ];
                    Embed.thumbnail.url = 'https://cdn.discordapp.com/attachments/1006146433247891566/1061309084982325318/smithing_success.png';
                    await message.channel.send({embeds : [Embed]}).catch(err => {
                        console.log(err);
                        if (err instanceof Discord.HTTPError) {
                            setTimeout(() => message.channel.send({embeds : [Embed]}), 10000)
                        }
                        return;
                    });
                    return;
                }
                if (result =="failed"){
                    console.log("00")
                    await KaelaBonkLevel.findOneAndUpdate({_id:KaelaBonkLevelPlayer._id},{createdTimestamp: message.createdAt})
                    Embed.title = "Forging Failed D:";
                    Embed.fields = [
                        { name :"Your level", value: `<a:elanguinsway:967462309276573727> level ${KaelaBonkLevelPlayer.level}`,inline: true},
                        { name :"Bonk count", value: `<:kaelanoted:961838924379062302> ${KaelaBonkLevelPlayer.bonk_count} bonk(s)`,inline: true},
                        { name :"Next bonk", value: `<t:${createdAtUnix+60*30}:R>`,inline: true},
                        { name :"Bonk needed for upgrade", value: `<a:kaelanumahammer:962582163251949578> ${bonkRequired(KaelaBonkLevelPlayer.level,KaelaBonkLevelPlayer.bonk_count)} bonk(s)`},
                    ];
                    Embed.thumbnail.url = 'https://cdn.discordapp.com/attachments/1006146433247891566/1061309084458029256/smithing_fail.png';
                    await message.channel.send({embeds : [Embed]}).catch(err => {
                        console.log(err);
                        if (err instanceof Discord.HTTPError) {
                            setTimeout(() => message.channel.send({embeds : [Embed]}), 10000)
                        }
                        return;
                    });
                    return;
                }
            }
        }
    }
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
