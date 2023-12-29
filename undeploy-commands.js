const { REST, Routes } = require('discord.js');
require('dotenv').config();

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

const commandID = '1187109106788610212'
const guildId = '761314667007442994'

// for guild-based commands
/*rest.delete(Routes.applicationGuildCommand(process.env.CLIENT_ID, guildId, commandID))
	.then(() => console.log('Successfully deleted guild command'))
	.catch(console.error);*/

// for global commands
rest.delete(Routes.applicationCommand(process.env.CLIENT_ID, commandID))
	.then(() => console.log('Successfully deleted application command'))
	.catch(console.error);