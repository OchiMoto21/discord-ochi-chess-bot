const mongoose = require('mongoose');
const KaelaBonkLevelSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    memberId: String,
    bonk_count: {type : Number, default: 0},
    level: {type : Number, default: 1},
    createdTimestamp: {type : Date, default : null}
});

module.exports = mongoose.model('KaelaBonkLevel', KaelaBonkLevelSchema,'KaelaBonkLevels');