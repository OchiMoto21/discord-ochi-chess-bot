const mongoose = require('mongoose');
const EmbedBuilderSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildId: String,
    memberId: String,
    messages: [{
        name : String,
        embed: {
            title: {
                type : String, 
                default: null,
                maxLength: 256
            },
            author: {
                name: {
                    type : String, 
                    default: null,
                    maxLength: 256
                },
                icon_url: {
                    type : String, 
                    default: null,
                },
                url: {
                    type : String, 
                    default: null,
                },
            },
            color: {type : String, default: null},
            description: {
                type : String, 
                default: null,
                maxLength: 4096
            },
            field:[{
                name: {
                    type : String, 
                    default: null,
                    maxLength: 256
                },
                value: {
                    type : String, 
                    default: null,
                    maxLength: 1024
                },
                inline: {type : String, default: null},
            }],
            image:{
                url: {
                    type:String, 
                    default:null
                }
            },
            timestamp: {
                type: Date, 
                default: null
            },
            footer: {
                text: {
                    type :String, 
                    default : null,
                    maxLength : 2048
                },
                icon_url: {
                    type : String, 
                    default : null
                },
            },
        
        },
        button: [{
            label: String, 
            link: String
        }]
    }]
});

module.exports = mongoose.model('EmbedBuilder', EmbedBuilderSchema,'EmbedBuilders');