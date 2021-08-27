const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const voiceDiscord = require('@discordjs/voice');

module.exports = {
    name: 'play',
    description: 'play a video from youtube',
    
    async execute(message, args, cmd, client, Discord){
        const channel = message.member.voice.channel;
        if (!channel) return message.channel.send('You need to be in the voice channel to use this command!'); 
        const permissions = channel.permissionsFor(message.client.user);
        if(!permissions.has('CONNECT')) return message.channel.send("You don't have the correct permission!");
        if(!permissions.has('SPEAK')) return message.channel.send("You don't have the correct permission!");
        if(!args.length) return message.channel.send('You need to add link in the second arguments!');

        const connection = voiceDiscord.joinVoiceChannel({
            channelId: channel.id,
            guildId: message.guild.id,
            adapterCreator: message.channel.guild.voiceAdapterCreator,
        });

    }
}