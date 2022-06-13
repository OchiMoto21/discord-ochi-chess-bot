const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema({
    name: String,
    value: String,
    inline: String,
})
const ChildEmbedSchema = new mongoose.Schema({
        title: String,
        description: String,
        field:[fieldSchema],
        image:{
            url:String
        }
})
const ButtonSchema = new mongoose.Schema({
        label: String, 
        link: String
    }
)
const EmbedBuilderSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildId: String,
    memberId: String,
    messages: [{
        name : String,
        embed: ChildEmbedSchema,
        button: [ButtonSchema]
    }]
});

module.exports = mongoose.model('EmbedBuilder', EmbedBuilderSchema,'EmbedBuilders');