const {
    Client,
    IntentsBitField,
    REST,
    Routes,
    Collection,
} = require('discord.js');
const { config } = require('dotenv');
const fs = require('fs');
const Logger = require('./utils/Logger');

Logger.info('Program STARTing...', 'START');

config();

Logger.info('Client is creating...', 'START');
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});
Logger.info('Client created !', 'START');

client.commands = new Collection();
client.commands.set('slash', new Collection());
client.commands.set('normal', new Collection());

Logger.info('Loading of \x1b[32m(/)\x1b[0m commands...', 'START');
fs.readdirSync('./src/commands/slash/')
    .filter((file) => file.endsWith('.js'))
    .forEach((element) => {
        const file = `./commands/slash/${element}`;
        const command = require(file); // eslint-disable-line import/no-dynamic-require, global-require
        client.commands.get('slash').set(command.help.name, command);
        Logger.info(
            `\tLoading the \x1b[32m${command.help.name}\x1b[0m (/) command`,
            'START'
        );
    });
Logger.info('Loading of \x1b[32m(/)\x1b[0m commands finished !', 'START');

Logger.info('Loading \x1b[32mEvent\x1b[0m...', 'START');
fs.readdirSync('./src/events')
    .filter((file) => file.endsWith('.js'))
    .forEach((element) => {
        const file = `./events/${element}`;
        const event = require(file); // eslint-disable-line import/no-dynamic-require, global-require
        Logger.info(
            `\tLoading the '\x1b[32m${event.name}\x1b[0m' event...`,
            'START'
        );
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
        Logger.info(`\t'\x1b[32m${event.name}\x1b[0m' event loaded !`, 'START');
    });

const main = async () => {
    try {
        const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

        const commands = [
            ...client.commands
                .get('slash')
                .map((element) => element.help.toJSON()),
        ];

        if (process.argv.includes('--DEV')) {
            Logger.info(
                `Started refreshing application (/) commands for guild : ${process.env.GUILD_ID_DEV}...`,
                'START'
            );
            await rest.put(
                Routes.applicationGuildCommands(
                    process.env.CLIENT_ID,
                    process.env.GUILD_ID_DEV
                ),
                {
                    body: commands,
                }
            );
            Logger.info(
                `Successfully reloaded application (/) commands for guild : ${process.env.GUILD_ID_DEV} !`,
                'START'
            );
        }

        client.login(process.env.TOKEN);
    } catch (e) {
        Logger.fatal('Error when registering (/) commands', e, -1);
    }
};

main();
