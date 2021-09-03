const ytdl = require('discord-ytdl-core');
const ytSearch = require('yt-search');
const voiceDiscord = require('@discordjs/voice');
const queue = new Map();
module.exports = {
    name: 'play',
    aliases: ['pause', 'stop','loop', 'queue'],
    description: 'Play a video from youtube',
    
    async execute(message, args, cmd, client, Discord){
        const channel = message.member.voice.channel;
        if (!channel) return message.channel.send('You need to be in the voice channel to use this command!'); 
        const permissions = channel.permissionsFor(message.client.user);
        if(!permissions.has('CONNECT')) return message.channel.send("You don't have the correct permission!");
        if(!permissions.has('SPEAK')) return message.channel.send("You don't have the correct permission!");
        

        let server_queue = queue.get(message.guild.id);
        if (cmd === "queue") {
            if (server_queue){
                if (!server_queue.songs.length) return message.channel.send("There's no queue!");
                return message.channel.send(server_queue.songs.join('\n'));
            } else {
	    	    return message.channel.send("There's no queue!");
	        }
        }

        if (cmd === "loop") {
            if (server_queue){
                server_queue.loop += 1;
                if (server_queue.loop === 1) {
                    message.channel.send("The song is now looped!");
                }
                if (server_queue.loop === 2) {
                    message.channel.send("The queue is now looped!");
                }
                if (server_queue.loop === 3) {
                    server_queue.loop = 0;
                    message.channel.send("The queue is not looped!");
                }
            } else {
		    message.channel.send("There's no song to loop on!");
	        }
        }

	    if (cmd === "pause") {
            if (server_queue){
                if (server_queue.playing){
                    server_queue.player.pause();
                    server_queue.playing = false;
                    return message.channel.send("The player is paused!");
                }
            } else {
	    	    return message.channel.send("There's no player to be paused!");
	        }
        } 
        
        if(cmd === "play"){
            if (!args.length && server_queue) {
                if(!server_queue.playing){
                    server_queue.player.unpause();
                    server_queue.playing = true;
                    return message.send.channel("The player is unpaused!");
                }
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
                    const player = voiceDiscord.createAudioPlayer( {
                        behaviors:  {
                            noSubscriber: voiceDiscord.NoSubscriberBehavior.Pause
                        }
                    }
                    );
                    const queue_constructor = {
                        guild: message.guild.id,
                        channel: message.channel, 
                        connection: connection,
                        player: player,
                        playing: false,
                        timeout: null,
                        loop: 0,
                        songs: [],
                    }
                    queue_constructor.connection.subscribe(queue_constructor.player);
                    queue.set(message.guild.id, queue_constructor);
                    console.log("-------------\nQueue is made\n-------------");
                    server_queue = queue_constructor;
                    server_queue.songs.push(video.url);
                    var n = 0;
                    video_player(server_queue,message,n);
                    
                    server_queue.player.on('error', error => {
                        server_queue.songs.shift();
                        server_queue.channel.send('There is an error playing the song!');
                        n += 1;
                        video_player(server_queue,message,n);
                    });
                    
                    server_queue.player.on(voiceDiscord.AudioPlayerStatus.Idle, () => {
                        if (server_queue.loop === 1) {
                            video_player(server_queue, message, n);
                        } else {
                            n += 1;
                            if ((server_queue.loop === 2) && (server_queue.songs.length === (n))) {
                                n = 0;
                                video_player(server_queue, message, n);
                            } else {
                                video_player(server_queue, message, n);
                            }
                        }
                    })
                    return message.channel.send(`👍 **${video.title}** added to queue!`);
                } else if (server_queue.songs.length === 0) {
                    server_queue.songs.push(video.url);
                    video_player(server_queue,message,0);
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
		        stop_player(server_queue,message);
            }  
        }
    }
}

const video_player = async (server_queue,message,n) => {
    if(n < server_queue.songs.length){
        clearTimeout(server_queue.timeout);
        const stream = ytdl(server_queue.songs[n],{
            filter:'audioonly', 
            opusEncoded: true,
            liveBuffer: 20000,
            highWaterMark: 1<<30
        });
        const resource = voiceDiscord.createAudioResource(stream, {type : "opus"});
        
        try {
            server_queue.player.play(resource);
            server_queue.playing = true;
        } catch(err) {
            console.log(err);
        }
    } else {
        console.log(n);
        console.log('Timeout set!')
        server_queue.timeout = setTimeout(() => stop_player(server_queue,message), 5_000);
    }

}

const stop_player = async (server_queue,message) => {
    server_queue.player.stop();
    queue.delete(server_queue.guild);

    const connection = voiceDiscord.getVoiceConnection(message.guild.id);
    if (connection){
        connection.destroy();
    }
}
