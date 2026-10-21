import { corsOptions } from './cors.config';

describe('corsOptions', () => {
    it('aceita qualquer origem quando CORS_ORIGIN não existe', () => {
        expect(corsOptions(() => undefined)).toEqual({});
    });

    it('aceita qualquer origem quando CORS_ORIGIN está vazia', () => {
        expect(corsOptions(() => ' , ')).toEqual({});
    });

    it('restringe à origem informada', () => {
        expect(corsOptions(() => 'https://missahoje.com.br')).toEqual({
            origin: ['https://missahoje.com.br'],
        });
    });

    it('aceita uma lista de origens separadas por vírgula', () => {
        expect(
            corsOptions(
                () => 'https://missahoje.com.br, https://www.missahoje.com.br',
            ),
        ).toEqual({
            origin: [
                'https://missahoje.com.br',
                'https://www.missahoje.com.br',
            ],
        });
    });
});
