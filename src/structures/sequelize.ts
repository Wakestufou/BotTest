import { Sequelize } from 'sequelize-typescript';
import { Roles } from './models/Roles';

const storageFile = process.argv.includes('--DEV')
    ? process.env.DATA_BASE_DEV
    : process.env.DATA_BASE;

export const sequelize = new Sequelize({
    dialect: 'sqlite',
    database: 'discord',
    storage: storageFile,
    models: [Roles],
});
