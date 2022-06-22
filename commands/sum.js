const KaelaBonkLevel = require('../schemas/KaelaBonkLevel')
const staff = ["287217424762404864","702053859274522675","511505655400628235","171846187320737792","298136213796290561","660841738952245248","435537136557490186","656974081140326401"]
module.exports = {
    name: 'sum',
    aliases: [],
    description: "This command will give your forging result",
    async execute(message, args, cmd, client, Discord){
        var embed = new Discord.MessageEmbed()
        if(message.channel.id == "825593098187833344"||message.channel.id=="966341480186789918"){
            const all = await KaelaBonkLevel.find({});
            console.log(all);
            var arrayofAll = {
                memberId:[],
                bonk_count:[]
            }
            all.forEach(element => {
                if (staff.includes(element.memberId)) return;
                arrayofAll.memberId.push(element.memberId);
                arrayofAll.bonk_count.push(element.bonk_count);
            });
            var result = arrayofAll.memberId[simulateEvent(arrayofAll.bonk_count)];
            console.log(result);
            console.log(arrayofAll);
            console.log(KaelaBonkLevel.aggregate([
                {$group: {_id:null, total_bonk: {$sum:"$bonk_count"} }}
            ],
            function (err,result){
                console.log(result)
            })
            )
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