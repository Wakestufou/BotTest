import { ExtendedClient } from './structures/Client';
import Logger from './utils/Logger';
import 'dotenv/config';
import fs from 'fs';
import { sequelize } from './structures/sequelize';

Logger.info('Program starting...', 'START');

// Check if .env file is completed
if (!fs.existsSync('./.env')) {
    Logger.fatal('Error : ', new Error('Please create .env file'), -1);
} else {
    if (process.argv.includes('--DEV')) {
        if (
            !process.env.APP_ID_DEV ||
            !process.env.TOKEN_DEV ||
            !process.env.GUILD_DEV ||
            !process.env.DATA_BASE_DEV
        ) {
            Logger.fatal(
                'Error : ',
                new Error(
                    'Please, complete the .env file as the .env.example file'
                ),
                -1
            );
        }
    } else {
        if (
            !process.env.APP_ID ||
            !process.env.TOKEN ||
            !process.env.DATA_BASE
        ) {
            Logger.fatal(
                'Error : ',
                new Error(
                    'Please, complete the .env file as the .env.example file'
                ),
                -1
            );
        }
    }
}

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
