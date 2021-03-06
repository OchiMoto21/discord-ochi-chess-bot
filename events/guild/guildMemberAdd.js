module.exports = async (Discord, client, member) => {
    await memberJoinedNotif (Discord,client,member).catch(err => console.log(err));
    if (member.user.bot) return;
    const passes = await checkVibe(Discord,client,member).catch(err => console.log(err));
}

const checkVibe = async (Discord,client,member) =>{
    const GuildSetting = await client.createGuildSettings(member);
    if (GuildSetting.AccountAgeLimit == null || GuildSetting.AccountAgeLimit == undefined) return;
    if (GuildSetting.TimeOut == null || GuildSetting.TimeOut == undefined) return;

    const Member = await client.createMemberJoined(member);
    Member["Passed"] = !(member.user.avatar == null && member.user.avatarURL() == null && (new Date().getTime() < (Member.CreatedAt.getTime() + GuildSetting.AccountAgeLimit.getTime())));
    await Member.save().catch(err => console.log(err));
    
    // console.log(Member);
    // console.log(GuildSetting);
    // console.log(member.kickable);
    // console.log(new Date().getTime() < (Member.CreatedAt.getTime() + GuildSetting.AccountAgeLimit.getTime()));
    
    if (!Member["Passed"]) {
        console.log(GuildSetting.TimeOut.getTime());
        setTimeout(async () => {
            const MemberTimeRunsOut = await client.createMemberJoined(member);
            console.log(MemberTimeRunsOut.Passed);

            if(member.kickable && (!MemberTimeRunsOut.Passed)){
                await member.kick();
                await memberKickedNotif(Discord,client,member).catch(err => console.log(err));
            }
            await MemberTimeRunsOut.remove().catch(err => console.log(err));
            return;
        },
            GuildSetting.TimeOut.getTime())
    }
    
}

const memberJoinedNotif = async (Discord,client,member) =>{
    const GuildSetting = await client.createGuildSettings(member);
    
    if (GuildSetting.LogChannel == null || GuildSetting.LogChannel == undefined) return;
    
    const joined = {
        author: {
            name : member.user.tag,
            icon_url : member.user.displayAvatarURL(), 
        },
        title: "Member Joined",
        thumbnail: {
            url : member.displayAvatarURL()
        },
        description : `Account Age: <t:${Math.floor(member.user.createdAt.getTime()/1000)}:F> (<t:${Math.floor(member.user.createdAt.getTime()/1000)}:R>)\n`
    }
    var chnl = await client.channels.fetch(GuildSetting.LogChannel);
    
    return await chnl.send({
        embeds : [joined]
    })
}

const memberKickedNotif = async (Discord,client,member) =>{
    const GuildSetting = await client.createGuildSettings(member);
    
    if (GuildSetting.LogChannel == null || GuildSetting.LogChannel == undefined) return;

    const kicked = {
        author: {
            name : member.user.tag,
            icon_url : member.user.displayAvatarURL(), 
        },
        title:"Member Kicked",
        thumbnail: {
            url : member.displayAvatarURL()
        },
        description: `Member doesn't suffice the requirement: \n- Account age is less than ${Math.floor(GuildSetting.AccountAgeLimit.getTime()/(24*3600*1000))} day(s) \n- No message sent after ${Math.floor(GuildSetting.TimeOut.getTime()/(1000))} second(s) \n- Using default avatar`
    }

    var chnl = await client.channels.fetch(GuildSetting.LogChannel);
    
    return await chnl.send({
        embeds : [kicked]
    })
}