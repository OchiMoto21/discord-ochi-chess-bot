//const config = require('../config.json');
const mongoose = require('mongoose');
const fs = require('fs');
const uri = process.env.mongoDB_TOKEN;
//const uri = config.mongoDB_TOKEN;
const mongodb_Eventfiles = fs.readdirSync(`./events/mongodb`).filter(file => file.endsWith('.js'));

module.exports = (client) => {
    
    for(const file of mongodb_Eventfiles){
        const mongo_event = require(`../events/mongodb/${file}`);
        if (mongo_event.once){
            mongoose.connection.once(mongo_event.name, (...args) => mongo_event.execute(...args));
        } else {
            mongoose.connection.on(mongo_event.name, (...args) => mongo_event.execute(...args));
        }
    }
    
    client.mongodbLogin = async () =>{
        mongoose.Promise = global.Promise;
        await mongoose.connect(uri, {
            useUnifiedTopology: true,
            useNewUrlParser: true, 
        })
    }
}