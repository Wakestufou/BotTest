import { Event } from '../structures/Event';
import { client } from '..';
import { CommandInteractionOptionResolver } from 'discord.js';
import { ExtendedInteraction } from '../types/Command';
import Logger from '../utils/Logger';

export default new Event('interactionCreate', async (interaction) => {
    if (interaction.isChatInputCommand()) {
        const command = client.getCommands().get(interaction.commandName);

        if (!command)
            return interaction.reply('You have used a non exitent command');

        try {
            command.run({
                args: interaction.options as CommandInteractionOptionResolver,
                client,
                interaction: interaction as ExtendedInteraction,
            });
        } catch (error) {
            Logger.error(
                `Error when executing the ${command.name} command`,
                error as Error
            );
        }
    } else if (interaction.isButton()) {
        try {
            if (
                (
                    interaction as unknown as ExtendedInteraction
                ).member.roles.cache.find((r) => r.id === interaction.customId)
            ) {
                await (
                    interaction as unknown as ExtendedInteraction
                ).member.roles.remove(interaction.customId);
                await interaction.reply({
                    content: `Role <@&${interaction.customId}> removed ! `,
                    ephemeral: true,
                });
            } else {
                await (
                    interaction as unknown as ExtendedInteraction
                ).member.roles.add(interaction.customId);
                await interaction.reply({
                    content: `Role <@&${interaction.customId}> added ! `,
                    ephemeral: true,
                });
            }
        } catch (e) {
            await interaction.reply({
                content: 'Error contact a admin !',
                ephemeral: true,
            });
            Logger.error('Error : ', e as Error);
        }
    }
});
