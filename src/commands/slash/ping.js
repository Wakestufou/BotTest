const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    help: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Check if the bot is alive')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        if (interaction.isCommand()) {
            await interaction.reply({ content: 'Pong !', ephemeral: true });
        }
    },
};
