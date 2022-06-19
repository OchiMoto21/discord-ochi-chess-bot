module.exports = (client, Discord) => {
    client.buttonRowGenerator = (buttons) =>{
        var buttonArray = [];
        if (buttons.length == 0){
            return null;
        }
        console.log(buttons)
        buttons.forEach(button => {
            if(isValidURL(button.link))
            buttonArray.push(new Discord.MessageButton()
            .setLabel(button.label)
            .setStyle('LINK')
            .setURL(button.link)
            )
        });
        if (buttonArray.length >= 1){
            var row = [new Discord.MessageActionRow()
                .addComponents(
                    buttonArray
                )]
            return row;
        } else {
            return null;
        }
    };
}
function isValidURL(string) {
    var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return (res !== null)
};