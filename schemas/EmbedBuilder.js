const mongoose = require('mongoose');
const EmbedBuilderSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildId: String,
    memberId: String,
    messages: [{
        name : String,
        embed: {
            title: {type : String, default: null},
            color: {type : String, default: null},
            description: {type : String, default: null},
            field:[{
                name: {type : String, default: null},
                value: {type : String, default: null},
                inline: {type : String, default: null},
            }],
            image:{
                url: {type:String, default:null}
            },
            timestamp: {type: Date, default:null},
            footer: {
                text: {type:String, default:null},
                icon_url: {type:String, default:null},
            },
        
        },
        button: [{
            label: String, 
            link: String
        }]
    }]
});

module.exports = mongoose.model('EmbedBuilder', EmbedBuilderSchema,'EmbedBuilders');