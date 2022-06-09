const mongoose = require('mongoose');

const EmbedBuilderSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildId: String,
    memberId: String,
    title: String,
    button: [{
        button_label: String, button_link: String
    }]
    
});

module.exports = mongoose.model('EmbedBuilder', EmbedBuilderSchema,'EmbedBuilders');