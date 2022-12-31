
module.exports = {
    name: 'set',
    aliases: [],
    description: "Command for setting each guild",
    async execute(message, args, cmd, client,   ){
        if (!message.member.permissions.has('ADMINISTRATOR')) return;
        const GuildSetting = await client.createGuildSettings(message.member);
        let m = args;
        console.log(m);
        switch (args[0]) {
            case "AccountAgeLimit":
                GuildSetting[args[0]] = DateConstructor(m.slice(1).join(" ").trim());
                break;
            case "TimeOut":
                GuildSetting[args[0]] = DateConstructor(m.slice(1).join(" ").trim());
                break;
            case "welcomeBanner": // Image inputs WIP
                console.log(message.attachments);
                break;
            default: // "LogChannel" "welcomeChannel" "welcomeMessage"
                GuildSetting[args[0]] = m.slice(1).join(" ").trim();
                break;
        }
        console.log(GuildSetting);
        await GuildSetting.save();
        
        console.log(`Guild ${message.guild.id} set`);
        return;
    }
}

//https://regex101.com/r/KpD1uq/1
const DateConstructor = (str) => {
    const regex = /((?<year>\d+)[y]|(?<day>\d+)[d]|(?<hour>\d+)[h]|(?<minute>\d+)[m]|(?<second>\d+)[s])/gm;
    console.log(str);
    let m;
    var milliseconds = 0;
    while ((m = regex.exec(str)) !== null) {
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }

        console.log(m.groups)
        for (const property in m.groups) {
            if (m.groups[property] == undefined) continue;
            var quantity = parseInt(m.groups[property]);
            switch (`${property}`) {
                case "year":
                    milliseconds += quantity*365*24*60*60*1000;
                    break;
                case "day":
                    milliseconds += quantity*24*60*60*1000;
                    break;
                case "hour":
                    milliseconds += quantity*60*60*1000;
                    break;
                case "minute":
                    milliseconds += quantity*60*1000;
                    break;
                case "second":
                    milliseconds += quantity*1000;
                    break;
                default:
                    break;
            }
        }
    }
    
    console.log(milliseconds);
    return new Date(milliseconds);
}