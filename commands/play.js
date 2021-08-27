const ytdl = require('discord-ytdl-core');
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
            adapterCreator: message.guild.voiceAdapterCreator
        });
        const player = voiceDiscord.createAudioPlayer();

        const videoFinder = async (query) => {
            const videoResult = await ytSearch(query);

            return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
        }

        const video = await videoFinder(args.join(' '));

        if(video){
            const stream = ytdl(video.url,{
                filter:'audioonly', 
                opusEncoded: true,
                liveBuffer: 4000,
                highWaterMark: 1<<25
            });
            const resource = voiceDiscord.createAudioResource(stream, {type : "opus"});
            try {
                player.play(resource);
                connection.subscribe(player);
                // console.log(resource);
            } catch(err) {
                console.log(err);
                // const Seek = resource.playbackDuration;
                // const new_stream = ytdl(video.url,{filter:'audioonly', opusEncoded: false});
                // const new_resource = voiceDiscord.createAudioResource(new_stream, {seek: Seek});
                // player.play(new_resource);
                // connection.subscribe(player);               
            }
            player.on('error', () => {
                const Seek = resource.playbackDuration;
                const new_resource = voiceDiscord.createAudioResource(stream, {type:"opus", seek: Seek});
                player.play(new_resource);
                connection.subscribe(player);
            })
            player.on('finish', () => {
                connection.destroy();
            });
            

            await message.channel.send(`:thumbsup: Now Playing ${video.title}`)
        } else {
            message.channel.send('No video results found');
        }
    }
}