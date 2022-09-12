const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require('discord.js');
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
                        .addStringOption((option) =>
                            option
                                .setName('description')
                                .setDescription('Description !')
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
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('message_roles')
                        .setDescription('Create a message with choice roles')
                        .addChannelOption((option) =>
                            option
                                .setName('channel')
                                .setDescription('Text Channel')
                                .setRequired(true)
                        )
                        .addStringOption((option) =>
                            option
                                .setName('title')
                                .setDescription('Title embed !')
                                .setRequired(true)
                        )
                        .addStringOption((option) =>
                            option
                                .setName('message')
                                .setDescription('Description !')
                                .setRequired(true)
                        )
                )
        ),
    async execute(interaction) {
        if (interaction.isCommand()) {
            if (interaction.options.getSubcommand() === 'add_role') {
                const role = interaction.options.getRole('role');
                const description =
                    interaction.options.getString('description');
                const db = JSON.parse(fs.readFileSync('./src/utils/db.json'));
                const guildID = interaction.member.guild.id;

                if (!db[guildID]) {
                    db[guildID] = {
                        roles: [],
                    };
                }
                db[guildID].roles.push({
                    name: role.name.toString(),
                    id: role.id.toString(),
                    desciption: description,
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

                if (!db[guildID]) {
                    await interaction.reply({
                        content: 'No db',
                        ephemeral: true,
                    });
                } else {
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
            } else if (interaction.options.getSubcommand() === 'list') {
                const guildID = interaction.member.guild.id;
                const db = JSON.parse(fs.readFileSync('./src/utils/db.json'));

                if (!db[guildID]) {
                    await interaction.reply({
                        content: 'No db',
                        ephemeral: true,
                    });
                } else {
                    await interaction.reply({
                        content: JSON.stringify(db[guildID]),
                        ephemeral: true,
                    });
                }
            } else if (
                interaction.options.getSubcommand() === 'message_roles'
            ) {
                const channel = interaction.options.getChannel('channel');
                const title = interaction.options.getString('title');
                const db = JSON.parse(fs.readFileSync('./src/utils/db.json'));
                const guildID = interaction.member.guild.id;
                const components = [];
                let desciption = interaction.options.getString('message');

                desciption += `\n**The roles :**\n`;

                if (!db[guildID]) {
                    desciption += 'No Role\n';
                } else {
                    db[guildID].roles.forEach((element) => {
                        components.push(
                            new ButtonBuilder()
                                .setCustomId(element.id)
                                .setLabel(element.name)
                                .setStyle(ButtonStyle.Primary)
                        );
                        desciption += `> **●** ${element.name} : ${
                            element.desciption === undefined
                                ? ''
                                : element.desciption
                        }\n`;
                    });
                }

                const embed = new EmbedBuilder()
                    .setTitle(title)
                    .setDescription(desciption);

                try {
                    await channel.send({
                        embeds: [embed],
                        components: [
                            new ActionRowBuilder().setComponents(...components),
                        ],
                    });
                    await interaction.reply({
                        content: 'Message created !',
                        ephemeral: true,
                    });
                } catch (e) {
                    await interaction.reply({
                        content:
                            'Error, please try again or contact Wakestufou',
                        ephemeral: true,
                    });
                }
            }
        }
    },
};
