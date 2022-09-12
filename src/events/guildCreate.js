const { Routes } = require('discord.js');
const Logger = require('../utils/Logger');

module.exports = {
    name: 'guildCreate',
    async execute(guild) {
        Logger.info(guild.name, 'MESSAGE');

        try {
            Logger.info(
                `Started refreshing application (/) commands for guild : ${guild.id}...`,
                'START'
            );
            await guild.client.rest.put(
                Routes.applicationGuildCommands(
                    process.env.CLIENT_ID,
                    guild.id
                ),
                {
                    body: [
                        ...guild.client.commands
                            .get('slash')
                            .map((element) => element.help.toJSON()),
                    ],
                }
            );
            Logger.info(
                `Successfully reloaded application (/) commands for guild : ${guild.id} !`,
                'START'
            );
        } catch (e) {
            Logger.error(
                `Error when registering (/) commands for ${guild.id}`,
                e
            );
        }
    },
};
