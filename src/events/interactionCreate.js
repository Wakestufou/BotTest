const Logger = require('../utils/Logger');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (interaction.isChatInputCommand() || interaction.isAutocomplete()) {
            const command = interaction.client.commands
                .get('slash')
                .get(interaction.commandName);

            try {
                await command.execute(interaction);
            } catch (error) {
                Logger.error('Error', error);
                if (interaction.isCommand())
                    await interaction.reply({
                        content:
                            'There was an error while executing this command!',
                        ephemeral: true,
                    });
            }
        } else if (interaction.isButton()) {
            try {
                if (
                    interaction.member.roles.cache.find(
                        (r) => r.id === interaction.customId
                    )
                ) {
                    await interaction.member.roles.remove(interaction.customId);
                    await interaction.reply({
                        content: 'Role removed ! ',
                        ephemeral: true,
                    });
                } else {
                    await interaction.member.roles.add(interaction.customId);
                    await interaction.reply({
                        content: 'Role added ! ',
                        ephemeral: true,
                    });
                }
            } catch (e) {
                await interaction.reply({
                    content: 'Error contact a admin !',
                    ephemeral: true,
                });
                Logger.error('Error : ', e);
            }
        }
    },
};
