const KaelaBonkLevel = require('../schemas/KaelaBonkLevel')
const mongoose = require('mongoose')
module.exports = (client) => {
    client.createBonkLevel = async (member) =>{
        let KaelaBonkLevelPlayer = await KaelaBonkLevel.findOne({memberId: member.id})
        if (KaelaBonkLevelPlayer){
            return KaelaBonkLevelPlayer;
        } else {
            //make a new data if it's not found in the database
            KaelaBonkLevelPlayer = await new KaelaBonkLevel({
                _id: mongoose.Types.ObjectId(),
                memberId: member.id
            })
            await KaelaBonkLevelPlayer.save().catch(err=> console.log(err));
            return KaelaBonkLevelPlayer;
        }
    };
}