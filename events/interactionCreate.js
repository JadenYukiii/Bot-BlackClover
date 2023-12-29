const { Events } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction, client) {
		if (interaction.isChatInputCommand()) {
			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}

			try {
				await command.execute(interaction);
			} catch (error) {
				console.error(error);
				if (interaction.replied || interaction.deferred) {
					await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
				} else {
					await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
				}
			}

		} else if (interaction.isButton()) {
			const customID = interaction.customId.split(':')[0];
			const button = client.buttons.get(customID);

			if(customID === 'skills') {
				await button.execute(interaction, interaction.customId.split(':')[1], interaction.customId.split(':')[2]);
				return;
			}

			if(customID === 'stats') {
				await button.execute(interaction, interaction.customId.split(':')[1]);
				return;
			}
			
			if(!button) return;

			await button.execute(interaction, client);
			
		} else if (interaction.isStringSelectMenu()) {
		}

		
	},
};
