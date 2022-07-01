const MemberJoined = require('../schemas/MemberJoined')
const mongoose = require('mongoose')
module.exports = (client) => {
    client.createMemberJoined = async (member) =>{
        let MemberJoined_member = await MemberJoined.findOne({GuildId: member.guild.id, MemberId: member.id, JoinedAt : member.joinedAt})
        if (MemberJoined_member){
            return MemberJoined_member;
        } else {
            //make a new data if it's not found in the database
            MemberJoined_member = await new MemberJoined({
                _id: mongoose.Types.ObjectId(),
                CreatedAt : member.user.createdAt,
                JoinedAt : member.joinedAt,
                GuildId : member.guild.id,
                MemberId : member.id,
                Avatar : member.user.avatar,
                AvatarURL : member.user.avatarURL(),
            })
            await MemberJoined_member.save().catch(err=> console.log(err));
            return MemberJoined_member;
        }
    };
}