const mongoose = require('mongoose');
const MemberJoinedSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,    
    CreatedAt : Date,
    JoinedAt : Date,
    GuildId : String,
    MemberId : String,
    Avatar : Object,
    AvatarURL : Object,
    Passed : {type: Boolean,default:false}
});

module.exports = mongoose.model('MemberJoined', MemberJoinedSchema,'MemberJoineds');