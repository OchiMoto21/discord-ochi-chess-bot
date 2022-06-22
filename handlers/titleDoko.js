module.exports = (client) => {
    client.titleDoko = (string) =>{
        var regex = /^\"(?<title>[^"]+)\"(?<argument>[\s\S]*)$/;
        console.log(regex, regex.test(string));
        if (regex.test(string)) {
            var groups = string.trim().match(regex).groups;
            return [groups.title, groups.argument.split(" ").filter(e =>  e)];
        }
        else {
            return [null, null];
        }
    };
}