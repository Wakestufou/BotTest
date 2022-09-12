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
        ),
    async execute(interaction) {
        if (interaction.isCommand()) {
            const role = interaction.options.getRole('role');
            const db = JSON.parse(fs.readFileSync('./src/utils/db.json'));
            const guildID = interaction.member.guild.id;

            db[guildID].roles.push({
                name: role.name.toString(),
                id: role.id.toString(),
            });

            fs.writeFileSync('./src/utils/db.json', JSON.stringify(db));
        }
    },
};
