module.exports = {
    name: 'ping',
    description: "this is ping command!",
    execute(message, args, cmd, client, Discord){
        
        //You can make the roles as 'let' variable
        // let role = member.guild.roles.cache.find(r => r.name === "Student");

        //Role permission \@Student
        if(message.member.roles.cache.some(r => r.name === "Student" )){
        //if(message.member.roles.cache.has('823436820578697216')){
            message.channel.send('pong');
            message.channel.send(message.author.tag);
        } else {
            message.channel.send('You are not a Student!');
            //Adding member roles and catch
            message.member.roles.add('823436820578697216').catch(console.error);
            //Remove member roles
            //message.member.roles.remove('823436820578697216');
        }
    }
}