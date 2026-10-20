import { extname, join } from 'path';
import { DataSourceOptions } from 'typeorm';

export type LerVariavel = (nome: string) => string | undefined;

const extensao = extname(__filename);

export function typeOrmOptions(ler: LerVariavel): DataSourceOptions {
    return {
        type: 'postgres',
        host: ler('DB_HOST'),
        port: Number(ler('DB_PORT') ?? 5432),
        username: ler('DB_USER'),
        password: ler('DB_PASS'),
        database: ler('DB_NAME'),
        entities: [join(__dirname, '..', '**', `*.entity${extensao}`)],
        migrations: [join(__dirname, 'migrations', `*${extensao}`)],
        synchronize: false,
    };
}
