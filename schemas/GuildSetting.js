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
        data : Buffer,
        contentType : String,
        default: null
    }
});

module.exports = mongoose.model('GuildSettings', GuildSettingsSchema,'GuildSettingss');