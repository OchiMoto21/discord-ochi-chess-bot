module.exports = async (Discord, client, interaction) => {
    if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'react') {
		const message = await interaction.reply('You can react with Unicode emojis!', { fetchReply: true });
		message.react('😄');
	}

}
