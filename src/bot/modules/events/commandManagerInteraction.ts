import {
	CommandInteractionOptionResolver,
	Interaction,
	ClientEvents,
} from 'discord.js';
import { Command, ExtendedInteraction } from '../../interfaces/Command';
import { ExtendedClient } from '../../interfaces/Client';
import BotEvent from '../../interfaces/Event';

// Slash commands handling
export default class SlashCommands implements BotEvent<'interactionCreate'> {
	event = 'interactionCreate';
	async run(interaction: Interaction) {
		// checks if the bot has booted(initialized)
		if (!(interaction.client as ExtendedClient).booted) return;
		// Chat Input Commands TYPE: CHAT_INPUT
		if (interaction.isCommand()) {
			await interaction.deferReply();
			const command = (interaction.client as ExtendedClient).slashCommands.find(
				(cmd) => {
					return (cmd as Command).name == interaction.command?.name;
				}
			) as Command;
			if (!command)
				return interaction.followUp('You have used a non existent command');
			await command.run({
				interactionOptions:
          interaction.options as CommandInteractionOptionResolver,
				client: interaction.client as ExtendedClient,
				interaction: interaction as ExtendedInteraction,
			});
		}
	}
}
