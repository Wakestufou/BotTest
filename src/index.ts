import { ExtendedClient } from './structures/Client';
import Logger from './utils/Logger';
import 'dotenv/config';
import { sequelize } from './structures/sequelize';

Logger.info('Program starting...', 'START');

Logger.info('Loading the database', 'START');
sequelize.sync({
    force: process.argv.includes('--DELETE'),
    alter: process.argv.includes('--UPDATE'),
});

Logger.info('Creating the client...', 'START');
export const client = new ExtendedClient();

Logger.info('Client created !', 'START');

Logger.info('Bot starting...', 'START');
client.start();
