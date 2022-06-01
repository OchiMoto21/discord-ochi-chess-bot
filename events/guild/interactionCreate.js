// https://discordjs.guide/creating-your-bot/command-handling.html#individual-command-files
module.exports = async (Discord, client, interaction) => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	const command = client.commands.get(commandName) || client.commands.find(a => a.aliases && a.aliases.includes(commandName))
	if(commandName) command.execute(commandName);

	// if (commandName === 'ping') {
	// 	await interaction.reply('Pong!');
	// } else if (commandName === 'server') {
	// 	await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
	// } else if (commandName === 'user') {
	// 	await interaction.reply(`Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`);
	// }
}
