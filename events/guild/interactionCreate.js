// https://discordjs.guide/creating-your-bot/command-handling.html#individual-command-files
module.exports = async (Discord, client, interaction) => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	const command = client.commands.get(commandName) || client.commands.find(a => a.aliases && a.aliases.includes(commandName))
	if(commandName) command.execute(commandName);

}
