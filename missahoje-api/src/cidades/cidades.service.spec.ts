import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Brackets, IsNull, Not } from 'typeorm';
import { CidadesService } from './cidades.service';
import { Cidade } from './entities/cidade.entity';
import * as paginateModule from 'nestjs-typeorm-paginate';

jest.mock('nestjs-typeorm-paginate', () => ({
    paginate: jest.fn(),
}));

describe('CidadesService', () => {
    let service: CidadesService;

    const mockCidadesRepository = {
        create: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        preload: jest.fn(),
        softRemove: jest.fn(),
        createQueryBuilder: jest.fn(),
    };

    const mockQueryBuilder = {
        orderBy: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CidadesService,
                {
                    provide: getRepositoryToken(Cidade),
                    useValue: mockCidadesRepository,
                },
            ],
        }).compile();

        service = module.get<CidadesService>(CidadesService);
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('deve criar uma nova cidade', async () => {
            const dto = {
                nome: 'Lavras',
                estado: 'MG',
                slug: 'lavras-mg',
                latitude: -21.2456,
                longitude: -44.9997,
            };
            const cidadeCriada = { id: '123', ...dto };

            mockCidadesRepository.create.mockReturnValue(cidadeCriada);
            mockCidadesRepository.save.mockResolvedValue(cidadeCriada);

            const resultado = await service.create(dto);

            expect(resultado).toEqual(cidadeCriada);
            expect(mockCidadesRepository.create).toHaveBeenCalledWith(dto);
            expect(mockCidadesRepository.save).toHaveBeenCalledWith(
                cidadeCriada,
            );
        });
    });

    describe('findAll', () => {
        const paginatedResult = {
            items: [{ id: '123', nome: 'Lavras', estado: 'MG' }],
            meta: {
                totalItems: 1,
                itemCount: 1,
                itemsPerPage: 10,
                totalPages: 1,
                currentPage: 1,
            },
        };

        beforeEach(() => {
            mockCidadesRepository.createQueryBuilder.mockReturnValue(
                mockQueryBuilder,
            );
            (paginateModule.paginate as jest.Mock).mockResolvedValue(
                paginatedResult,
            );
        });

        it('deve retornar uma lista paginada de cidades em ordem alfabética', async () => {
            const resultado = await service.findAll({ page: 1, limit: 10 });

            expect(resultado).toEqual(paginatedResult);
            expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
                'cidade.nome',
                'ASC',
            );
            expect(mockQueryBuilder.andWhere).not.toHaveBeenCalled();
            expect(paginateModule.paginate).toHaveBeenCalledWith(
                mockQueryBuilder,
                { page: 1, limit: 10 },
            );
        });

        it('filtra por nome e slug sem acento nem caixa', async () => {
            await service.findAll({ nome: '  São João ' });

            expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
                expect.any(Brackets),
                expect.objectContaining({
                    nome: '%sao joao%',
                    slug: '%sao-joao%',
                }),
            );
        });

        it('escapa os curingas do LIKE no termo buscado', async () => {
            await service.findAll({ nome: '100%' });

            expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
                expect.any(Brackets),
                expect.objectContaining({ nome: '%100\\%%' }),
            );
        });

        it('ignora nome só de espaços', async () => {
            await service.findAll({ nome: '   ' });

            expect(mockQueryBuilder.andWhere).not.toHaveBeenCalled();
        });
    });

    describe('findNearest', () => {
        const lavras = {
            id: '123',
            nome: 'Lavras',
            estado: 'MG',
            latitude: -21.2456,
            longitude: -44.9997,
        };

        it('busca só cidades com centro cadastrado e devolve a mais próxima', async () => {
            mockCidadesRepository.find.mockResolvedValue([lavras]);

            const resultado = await service.findNearest({
                lat: -21.245,
                lng: -44.999,
            });

            expect(resultado).toEqual(lavras);
            expect(mockCidadesRepository.find).toHaveBeenCalledWith({
                where: { latitude: Not(IsNull()), longitude: Not(IsNull()) },
            });
        });

        it('deve lançar um NotFoundException se nenhuma cidade estiver perto', async () => {
            mockCidadesRepository.find.mockResolvedValue([lavras]);

            await expect(
                service.findNearest({ lat: -23.55, lng: -46.633 }),
            ).rejects.toThrow(NotFoundException);
        });
    });

    describe('findOne', () => {
        it('deve retornar uma cidade se o ID existir', async () => {
            const cidadeEsperada = { id: '123', nome: 'Lavras', estado: 'MG' };

            mockCidadesRepository.findOne.mockResolvedValue(cidadeEsperada);

            const resultado = await service.findOne('123');

            expect(resultado).toEqual(cidadeEsperada);
            expect(mockCidadesRepository.findOne).toHaveBeenCalledWith({
                where: { id: '123' },
            });
        });

        it('deve lançar um NotFoundException se a cidade não existir', async () => {
            mockCidadesRepository.findOne.mockResolvedValue(null);

            await expect(service.findOne('999')).rejects.toThrow(
                NotFoundException,
            );
        });
    });

    describe('update', () => {
        it('deve atualizar a cidade se ela existir', async () => {
            const dto = { nome: 'Lavras Atualizada' };
            const cidadePreloaded = {
                id: '123',
                nome: 'Lavras Atualizada',
                estado: 'MG',
            };

            mockCidadesRepository.preload.mockResolvedValue(cidadePreloaded);
            mockCidadesRepository.save.mockResolvedValue(cidadePreloaded);

            const resultado = await service.update('123', dto);

            expect(resultado).toEqual(cidadePreloaded);
            expect(mockCidadesRepository.preload).toHaveBeenCalledWith({
                id: '123',
                ...dto,
            });
            expect(mockCidadesRepository.save).toHaveBeenCalledWith(
                cidadePreloaded,
            );
        });

        it('deve lançar um NotFoundException se tentar atualizar uma cidade que não existe', async () => {
            const dto = { nome: 'Inexistente' };

            mockCidadesRepository.preload.mockResolvedValue(null);

            await expect(service.update('999', dto)).rejects.toThrow(
                NotFoundException,
            );
            expect(mockCidadesRepository.save).not.toHaveBeenCalled();
        });
    });

    describe('remove', () => {
        it('deve remover logicamente (softRemove) a cidade', async () => {
            const cidadeEsperada = { id: '123', nome: 'Lavras', estado: 'MG' };

            mockCidadesRepository.findOne.mockResolvedValue(cidadeEsperada);
            mockCidadesRepository.softRemove.mockResolvedValue(cidadeEsperada);

            const resultado = await service.remove('123');

            expect(resultado).toEqual(cidadeEsperada);
            expect(mockCidadesRepository.findOne).toHaveBeenCalledWith({
                where: { id: '123' },
            });
            expect(mockCidadesRepository.softRemove).toHaveBeenCalledWith(
                cidadeEsperada,
            );
        });

        it('deve lançar um NotFoundException se tentar remover uma cidade que não existe', async () => {
            mockCidadesRepository.findOne.mockResolvedValue(null);

            await expect(service.remove('999')).rejects.toThrow(
                NotFoundException,
            );
            expect(mockCidadesRepository.softRemove).not.toHaveBeenCalled();
        });
    });
});
