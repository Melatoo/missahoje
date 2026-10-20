import { join } from 'path';
import { typeOrmOptions } from './typeorm.config';

const variaveis: Record<string, string> = {
    DB_HOST: 'banco',
    DB_PORT: '6543',
    DB_USER: 'usuario',
    DB_PASS: 'senha',
    DB_NAME: 'missas',
};

describe('typeOrmOptions', () => {
    it('lê a conexão das variáveis recebidas', () => {
        expect(typeOrmOptions((nome) => variaveis[nome])).toMatchObject({
            type: 'postgres',
            host: 'banco',
            port: 6543,
            username: 'usuario',
            password: 'senha',
            database: 'missas',
        });
    });

    it('usa a porta padrão do Postgres quando DB_PORT não existe', () => {
        expect(typeOrmOptions(() => undefined)).toMatchObject({ port: 5432 });
    });

    it('usa a porta padrão do Postgres quando DB_PORT está vazia', () => {
        expect(typeOrmOptions(() => '')).toMatchObject({ port: 5432 });
    });

    it('nunca sincroniza o schema sozinho', () => {
        expect(typeOrmOptions(() => undefined).synchronize).toBe(false);
    });

    it('carrega migrations e entidades com a extensão do código em execução', () => {
        const opcoes = typeOrmOptions(() => undefined);

        expect(opcoes.migrations).toEqual([
            join(__dirname, 'migrations', '*.ts'),
        ]);
        expect(opcoes.entities).toEqual([
            join(__dirname, '..', '**', '*.entity.ts'),
        ]);
    });
});
