import { existsSync } from 'fs';
import { DataSource } from 'typeorm';
import { typeOrmOptions } from './typeorm.config';

if (existsSync('.env')) {
    process.loadEnvFile();
}

export default new DataSource(typeOrmOptions((nome) => process.env[nome]));
