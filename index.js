const Discord = require('discord.js');
//const config = require('./config.json');
//require('./deploy_command.js')

//const { MongoClient, ServerApiVersion } = require('mongodb');

const client = new Discord.Client({
    intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS]
});

const fs = require('fs');


client.commands = new Discord.Collection();

client.events = new Discord.Collection();
['command_handler', 'event_handler'].forEach(handler =>{
    require(`./handlers/${handler}`)(client, Discord);
})

//client.login(config.TOKEN);
client.login(process.env.DJS_TOKEN);