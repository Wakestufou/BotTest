const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const Logger = require('../../utils/Logger');

module.exports = {
    help: new SlashCommandBuilder()
        .setName('add_role')
        .setDescription('Add you a role')
        .addStringOption((option) =>
            option
                .setName('role')
                .setDescription('Select your role from the list !')
                .setRequired(true)
                .setAutocomplete(true)
        ),
    async execute(interaction) {
        const rawdata = fs.readFileSync('./src/utils/db.json');
        const db = JSON.parse(rawdata);
        const guildID = interaction.member.guild.id;

        const guild = db[guildID];

        const choices = [];

        for (let i = 0; i < guild.roles.length; i += 1) {
            choices.push({
                name: `${guild.roles[i].name}`,
                value: `${guild.roles[i].id}`,
            });
        }

        if (interaction.isAutocomplete()) {
            interaction
                .respond(choices)
                .catch((error) => Logger.error('Error :', error));
        }

        if (interaction.isCommand()) {
            await interaction.guild.roles.fetch();
            const role = interaction.guild.roles.cache.find(
                (r) => r.id === interaction.options.getString('role')
            );

            if (!role) {
                await interaction.reply({
                    content: 'No Role',
                    ephemeral: true,
                });
            } else {
                await interaction.member.roles.add(role);
                await interaction.reply({
                    content: 'Role added !',
                    ephemeral: true,
                });
            }
        }
    },
};
