const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');

module.exports = {
    help: new SlashCommandBuilder()
        .setName('admin')
        .setDescription('Commands for admin')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommandGroup((group) =>
            group
                .setName('db')
                .setDescription('Configure the db')
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('add_role')
                        .setDescription('Add role on db')
                        .addRoleOption((option) =>
                            option
                                .setName('role')
                                .setDescription('The role to be added !')
                                .setRequired(true)
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('remove_role')
                        .setDescription('Remove a role on db')
                        .addRoleOption((option) =>
                            option
                                .setName('role')
                                .setDescription('The role to be removed !')
                                .setRequired(true)
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand.setName('list').setDescription('Show data on db')
                )
        ),
    async execute(interaction) {
        if (interaction.isCommand()) {
            if (interaction.options.getSubcommand() === 'add_role') {
                const role = interaction.options.getRole('role');
                const db = JSON.parse(fs.readFileSync('./src/utils/db.json'));
                const guildID = interaction.member.guild.id;

                db[guildID].roles.push({
                    name: role.name.toString(),
                    id: role.id.toString(),
                });

                fs.writeFileSync('./src/utils/db.json', JSON.stringify(db));

                await interaction.reply({
                    content: 'Role Added !',
                    ephemeral: true,
                });
            } else if (interaction.options.getSubcommand() === 'remove_role') {
                const role = interaction.options.getRole('role');
                const guildID = interaction.member.guild.id;
                const db = JSON.parse(fs.readFileSync('./src/utils/db.json'));

                const dbRole = [];

                dbRole.push(
                    ...db[guildID].roles.filter(
                        (element) => element.id !== role.id.toString()
                    )
                );

                db[guildID].roles = dbRole;

                fs.writeFileSync('./src/utils/db.json', JSON.stringify(db));

                await interaction.reply({
                    content: 'Role Removed !',
                    ephemeral: true,
                });
            }
        }
    },
};
