const EmbedBuilder = require('../schemas/EmbedBuilder')
const mongoose = require('mongoose')
module.exports = (client) => {
    client.createEmbedBuilder = async (guild,member) =>{
        let EmbedBuilderUser = await EmbedBuilder.findOne({guildId:guild.id, memberId: member.id})
        if (EmbedBuilderUser){
            return EmbedBuilderUser;
        } else {
            //make a new data if it's not found in the database
            EmbedBuilderUser = await new EmbedBuilder({
                _id: mongoose.Types.ObjectId(),
                guildId: guild.id,
                memberId: member.id
            })
            await EmbedBuilderUser.save().catch(err=> console.log(err));
            return EmbedBuilderUser;
        }
    };
}