const Discord = require('discord.js');
require('dotenv').config();

const client = new Discord.Client({
    intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,Discord.Intents.FLAGS.GUILD_MEMBERS]
});

const fs = require('fs');


client.commands = new Discord.Collection();

client.events = new Discord.Collection();
const handlers_files = fs.readdirSync('./handlers').filter(file => file.endsWith('.js'));

console.log(handlers_files);
handlers_files.forEach(handler =>{
    require(`./handlers/${handler}`)(client, Discord);
})

client.mongodbLogin();
client.login(process.env.DJS_TOKEN);
