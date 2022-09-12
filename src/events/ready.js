const { Routes } = require('discord.js');
const Logger = require('../utils/Logger');

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        Logger.info(`${client.user.tag} has logged in !`);
        if (!process.argv.includes('--DEV')) {
            client.guilds.cache.forEach(async (guild) => {
                Logger.info(
                    `Started refreshing application (/) commands for guild : ${guild.name}...`,
                    'START'
                );
                await client.rest.put(
                    Routes.applicationGuildCommands(
                        process.env.CLIENT_ID,
                        guild.id
                    ),
                    {
                        body: [
                            ...client.commands
                                .get('slash')
                                .map((element) => element.help.toJSON()),
                        ],
                    }
                );
                Logger.info(
                    `Successfully reloaded application (/) commands for guild : ${guild.name} !`,
                    'START'
                );
            });
        }
    },
};
