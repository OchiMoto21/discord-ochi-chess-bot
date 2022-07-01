const GuildSetting = require('../schemas/GuildSetting')
const mongoose = require('mongoose')
module.exports = (client) => {
    client.createGuildSettings = async (member) =>{
        let OneGuildSetting = await GuildSetting.findOne({GuildId: member.guild.id})
        if (OneGuildSetting){
            return OneGuildSetting;
        } else {
            //make a new data if it's not found in the database
            OneGuildSetting = await new GuildSetting({
                _id: mongoose.Types.ObjectId(),
                GuildId : member.guild.id
            })
            await OneGuildSetting.save().catch(err=> console.log(err));
            return OneGuildSetting;
        }
    };
}