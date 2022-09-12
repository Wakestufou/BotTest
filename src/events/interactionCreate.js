const Logger = require('../utils/Logger');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (
            interaction.isChatInputCommand() ||
            interaction.type !== 'APPLICATION_COMMAND_AUTOCOMPLETE'
        ) {
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
        }
    },
};
