const mongoose = require('mongoose');
const GuildSettingsSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    GuildId:String,    
    LogChannel:String,
    TimeOut: {
        type: Date,
        default: null
    },
    AccountAgeLimit: {
        type: Date,
        default: null
    },
    welcomeChannel : String,
    welcomeMessage : {
        type: String,
        default: null
    },
    welcomeBanner : {
        name: String,
        img:
        {
            data: Buffer,
            contentType: String,
        }
    }
});

module.exports = mongoose.model('GuildSettings', GuildSettingsSchema,'GuildSettingss');