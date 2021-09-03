const ytdl = require('discord-ytdl-core');
const ytSearch = require('yt-search');
const voiceDiscord = require('@discordjs/voice');
const queue = new Map();
module.exports = {
    name: 'play',
    aliases: ['pause', 'stop','loop'],
    description: 'play a video from youtube',
    
    async execute(message, args, cmd, client, Discord){
        const channel = message.member.voice.channel;
        if (!channel) return message.channel.send('You need to be in the voice channel to use this command!'); 
        const permissions = channel.permissionsFor(message.client.user);
        if(!permissions.has('CONNECT')) return message.channel.send("You don't have the correct permission!");
        if(!permissions.has('SPEAK')) return message.channel.send("You don't have the correct permission!");
        

        let server_queue = queue.get(message.guild.id);
        if (cmd == "loop") {
            if (server_queue){
                server_queue.loop = !server_queue.loop;
            } else {
		message.channel.send("There's no song to loop on!");
	    }
        }
	if (cmd == "pause") {
            if (server_queue){
		server_queue.player.on(voiceDiscord.AudioPlayerStatus.Playing, () => {
			server_queue.player.pause();
			message.channel.send("The player is paused!");
		});
            } else {
	    	message.channel.send("There's no player to be paused!");
	    }
        } 
        
        if(cmd === "play"){
	    if (server_queue){
		 server_queue.player.on(voiceDiscord.AudioPlayerStatus.Paused, () => {
			server_queue.player.unpause();
			return message.channel.send("The player is unpaused!");
		 });
	    }
			
            if(!args.length) return message.channel.send('You need to add link in the second arguments!');
            const videoFinder = async (query) => {
                const videoResult = await ytSearch(query);
    
                return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
            }
    
            const video = await videoFinder(args.join(' '));
            if(video){
                if (!server_queue){
                    
                    const connection = voiceDiscord.joinVoiceChannel({
                        channelId: channel.id,
                        guildId: message.guild.id,
                        adapterCreator: message.guild.voiceAdapterCreator
                    });
                    const player = voiceDiscord.createAudioPlayer();
                    const queue_constructor = {
                        guild: message.guild.id,
                        channel: message.channel, 
                        connection: connection,
                        player: player,
                        songs: [],
                        loop: false
                    }
                    queue_constructor.connection.subscribe(queue_constructor.player);
                    queue.set(message.guild.id, queue_constructor);
                    console.log("_____________\n queue is made \n_________________");
                    server_queue = queue_constructor;
                    server_queue.songs.push(video.url);
                    video_player(server_queue);
                    return message.channel.send(`👍 **${video.title}** added to queue!`);
                } else if (server_queue.songs.length === 0) {
                    server_queue.songs.push(video.url);
                    video_player(server_queue);
                    return message.channel.send(`👍 **${video.title}** added to queue!`);
                } else {
                    server_queue.songs.push(video.url);
                    return message.channel.send(`👍 **${video.title}** added to queue!`);
                }
            } else {
                return message.channel.send('No video results found');
            }
        }
        if(cmd === "stop"){
            if(server_queue){
		server_queue.player.stop();
                queue.delete(server_queue.guild);
		
            }
            const connection = voiceDiscord.getVoiceConnection(message.guild.id);
            if (connection){
                connection.destroy();
            }
        }  
    }
}

const video_player = async (server_queue) => {
    if(server_queue.songs.length > 0){
        const stream = ytdl(server_queue.songs[0],{
            filter:'audioonly', 
            opusEncoded: true,
            liveBuffer: 20000,
            highWaterMark: 1<<30
        });
        const resource = voiceDiscord.createAudioResource(stream, {type : "opus"});
        
        try {
            server_queue.player.play(resource);
        } catch(err) {
            console.log(err);
        }
        server_queue.player.on('error', error => {
		console.error(`Error: ${error.message} with resource ${error.resource.metadata.title}`);
		server_queue.songs.shift();
		server_queue.channel.send('There is an error playing the song!');
		video_player(server_queue);
	});
        server_queue.player.on(voiceDiscord.AudioPlayerStatus.Idle, () => {
            if (!server_queue.loop){
                server_queue.songs.shift();
            }
            video_player(server_queue);
        })
    }
}
