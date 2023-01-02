const Canvas = require('@napi-rs/canvas');
const { Message } = require('discord.js');

module.exports = async (Discord, client, member) => {
    const GuildSetting = await client.createGuildSettings(member);
    await welcomeNotif (Discord,client,member,GuildSetting).catch(err => console.log(err));
    await memberJoinedNotif (Discord,client,member,GuildSetting).catch(err => console.log(err));
    if (member.user.bot) return;
    const passes = await checkVibe(Discord,client,member).catch(err => console.log(err));
}


const welcomeNotif = async (Discord,client,member,GuildSetting) => {
    console.log(GuildSetting);
    if (GuildSetting.welcomeChannel == null || GuildSetting.welcomeChannel == undefined) return;
    if ((GuildSetting["welcomeMessage"] == null || GuildSetting["welcomeMessage"] == undefined) && (GuildSetting["welcomeBanner"]["img"]["data"] == null || GuildSetting["welcomeBanner"]["img"]["data"] == undefined)) return;
    var chnl = await client.channels.fetch(GuildSetting.welcomeChannel);

    if ((GuildSetting["welcomeBanner"]["img"]["data"] == null || GuildSetting["welcomeBanner"]["img"]["data"] == undefined)){
        const mentionMessage = GuildSetting["welcomeMessage"].replace("&mention", `<@${member.user.id}>`)
        return await chnl.send({
            content : mentionMessage
        })
    }
    
    if ((GuildSetting["welcomeMessage"] == null || GuildSetting["welcomeMessage"] == undefined)){
        const imageBuffer = GuildSetting["welcomeBanner"]["img"]["data"];
        const avatarURL = await client.downloadImage(member.user.displayAvatarURL({ format: 'jpg' })).catch((err) => message.react('❌'));
        const userTag = member.user.tag; 

        const resizedImage = await client.createBanner(imageBuffer,avatarURL, userTag);

        return await chnl.send({
            files: [{
                attachment: resizedImage,
                name: "image.jpg"
            }]
        })
    }

    const mentionMessage = GuildSetting["welcomeMessage"].replace("&mention", `<@${member.user.id}>`)
    const imageBuffer = GuildSetting["welcomeBanner"]["img"]["data"];
    const avatarURL = await client.downloadImage(member.user.displayAvatarURL({ format: 'jpg' })).catch((err) => message.react('❌'));
    const userTag = member.user.tag; 

    const resizedImage = await client.createBanner(imageBuffer,avatarURL, userTag);

    return await chnl.send({
        content : mentionMessage,
        files: [{
            attachment: resizedImage,
            name: "image.jpg"
        }]
    })    
    // AttachmentBuilder(buffer, { name: 'image.png' });
}

const memberJoinedNotif = async (Discord,client,member,GuildSetting) =>{
    
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

const checkVibe = async (Discord,client,member) =>{
    const GuildSetting = await client.createGuildSettings(member);
    if (GuildSetting.AccountAgeLimit == null || GuildSetting.AccountAgeLimit == undefined) return;
    if (GuildSetting.TimeOut == null || GuildSetting.TimeOut == undefined) return;

    const Member = await client.createMemberJoined(member);
    Member["Passed"] = !(member.user.avatar == null && member.user.avatarURL() == null && (new Date().getTime() < (Member.CreatedAt.getTime() + GuildSetting.AccountAgeLimit.getTime())));
    await Member.save().catch(err => console.log(err));
        
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