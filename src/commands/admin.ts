import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    TextChannel,
} from 'discord.js';
import { Command } from '../structures/Command';
import { Roles } from '../structures/models/Roles';
import Logger from '../utils/Logger';

export default new Command({
    name: 'admin',
    description: 'Command for Admin',
    default_member_permissions: '8',
    options: [
        {
            type: 2,
            name: 'db',
            description: 'Configure the db',
            options: [
                {
                    type: 1,
                    name: 'add_role',
                    description: 'Add role on db',
                    options: [
                        {
                            type: 8,
                            name: 'role',
                            description: 'The role to be added !',
                            required: true,
                        },
                        {
                            type: 3,
                            name: 'description',
                            description: 'Description !',
                            required: true,
                        },
                    ],
                },
                {
                    type: 1,
                    name: 'remove_role',
                    description: 'Remove a role on db !',
                    options: [
                        {
                            type: 8,
                            name: 'role',
                            description: 'The role to be removed !',
                            required: true,
                        },
                    ],
                },
                {
                    type: 1,
                    name: 'list',
                    description: 'Show data on db',
                },
            ],
        },
        {
            type: 2,
            name: 'message',
            description: 'Send Message',
            options: [
                {
                    type: 1,
                    name: 'message_roles',
                    description: 'Create a message with choice roles',
                    options: [
                        {
                            type: 7,
                            name: 'channel',
                            description: 'Text Channel',
                            required: true,
                        },
                        {
                            type: 3,
                            name: 'title',
                            description: 'Title embed !',
                            required: true,
                        },
                        {
                            type: 3,
                            name: 'message',
                            description: 'Description embed !',
                            required: true,
                        },
                    ],
                },
            ],
        },
    ],
    run: async ({ interaction, args }) => {
        if (interaction.isCommand()) {
            const options = args;
            if (options.getSubcommand() === 'add_role') {
                const role = options.getRole('role');
                const description = options.getString('description');

                Roles.count({
                    where: {
                        id_guild: interaction.member.guild.id,
                        id_role: role?.id as string,
                    },
                })
                    .then((count) => {
                        if (count !== 0) {
                            return true;
                        }
                        return false;
                    })
                    .then((exist) => {
                        if (exist) {
                            return interaction.reply({
                                content: 'Role already existing !',
                                ephemeral: true,
                            });
                        }

                        const new_role = new Roles({
                            id_guild: interaction.member.guild.id,
                            id_role: role?.id as string,
                            name: role?.name as string,
                            description: description as string,
                        });

                        new_role.save();

                        return interaction.reply({
                            content: 'Role added !',
                            ephemeral: true,
                        });
                    })
                    .catch((e) => Logger.error('Error', e));
            } else if (options.getSubcommand() === 'remove_role') {
                const role = options.getRole('role');

                Roles.destroy({
                    where: {
                        id_guild: interaction.member.guild.id,
                        id_role: role?.id as string,
                    },
                })
                    .then(() => {
                        return interaction.reply({
                            content: 'Role deleted !',
                            ephemeral: true,
                        });
                    })
                    .catch((e) => Logger.error('Error : ', e));
            } else if (options.getSubcommand() === 'list') {
                Roles.findAll({
                    where: {
                        id_guild: interaction.member.guild.id,
                    },
                })
                    .then(async (element) => {
                        return interaction.reply({
                            content: `Roles : ${JSON.stringify(element)}`,
                            ephemeral: true,
                        });
                    })
                    .catch((e) => Logger.error('Error : ', e));
            } else if (options.getSubcommand() === 'message_roles') {
                const channel = options.getChannel('channel');
                const title = options.getString('title');
                const guildID = interaction.member.guild.id;

                const tab: [
                    {
                        embed: EmbedBuilder;
                        components: ButtonBuilder[];
                    }
                ] = [] as unknown as [
                    {
                        embed: EmbedBuilder;
                        components: ButtonBuilder[];
                    }
                ];

                let description = options.getString('message');

                description += `\n**The roles :**\n`;

                Roles.findAll({
                    where: {
                        id_guild: guildID,
                    },
                })
                    .then((element) => {
                        if (element.length === 0) {
                            description += 'No Role\n';
                            tab.push({
                                embed: new EmbedBuilder()
                                    .setTitle(title)
                                    .setDescription(description),
                                components: [],
                            });
                        } else {
                            let i = 0;
                            element.forEach((el) => {
                                if (i % 5 === 0) {
                                    tab.push({
                                        embed: new EmbedBuilder()
                                            .setTitle(title)
                                            .setDescription('Oui'),
                                        components: [],
                                    });
                                    description =
                                        options.getString('message') +
                                        '\n**The roles :**\n';
                                }

                                tab[tab.length - 1].components.push(
                                    new ButtonBuilder()
                                        .setCustomId(el.getDataValue('id_role'))
                                        .setLabel(el.getDataValue('name'))
                                        .setStyle(ButtonStyle.Primary)
                                );

                                description += `> **●** ${el.getDataValue(
                                    'name'
                                )} : ${
                                    el.getDataValue('description') === undefined
                                        ? ''
                                        : el.getDataValue('description')
                                }\n`;
                                tab[tab.length - 1].embed.setDescription(
                                    description
                                );

                                i++;
                            });
                        }

                        return;
                    })
                    .then(() => {
                        if (channel instanceof TextChannel) {
                            tab.forEach((element) => {
                                if (element.components.length === 0) {
                                    channel
                                        .send({
                                            embeds: [element.embed],
                                        })
                                        .then(() => {
                                            Logger.info(
                                                'Message role created !'
                                            );
                                        })
                                        .catch((e) =>
                                            Logger.error(
                                                'Error when create message role :',
                                                e
                                            )
                                        );
                                } else {
                                    channel
                                        .send({
                                            embeds: [element.embed],
                                            components: [
                                                new ActionRowBuilder<ButtonBuilder>().setComponents(
                                                    ...element.components
                                                ),
                                            ],
                                        })
                                        .then(() => {
                                            Logger.info(
                                                'Message role created !'
                                            );
                                        })
                                        .catch((e) =>
                                            Logger.error(
                                                'Error when create message role :',
                                                e
                                            )
                                        );
                                }
                            });

                            return interaction.reply({
                                content: 'Message created !',
                                ephemeral: true,
                            });
                        } else {
                            return interaction.reply({
                                content: 'Message must be in Text Channel !',
                                ephemeral: true,
                            });
                        }
                    })
                    .catch((e) =>
                        Logger.error('Error when message role command', e)
                    );
            }
        }
    },
});
