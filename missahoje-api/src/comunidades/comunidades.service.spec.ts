import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { ComunidadesService } from './comunidades.service';
import { Comunidade } from './entities/comunidade.entity';
import * as paginateModule from 'nestjs-typeorm-paginate';

jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn(),
}));

describe('ComunidadesService', () => {
  let service: ComunidadesService;

  const mockComunidadesRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    preload: jest.fn(),
    softRemove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ComunidadesService,
        {
          provide: getRepositoryToken(Comunidade),
          useValue: mockComunidadesRepository,
        },
      ],
    }).compile();

    service = module.get<ComunidadesService>(ComunidadesService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deve criar uma nova comunidade', async () => {
      const dto = { nome: 'Comunidade Teste', cidade_id: '1', paroquia_id: '1' };
      const comunidadeCriada = { id: '123', ...dto };

      mockComunidadesRepository.create.mockReturnValue(comunidadeCriada);
      mockComunidadesRepository.save.mockResolvedValue(comunidadeCriada);

      const resultado = await service.create(dto as any);

      expect(resultado).toEqual(comunidadeCriada);
      expect(mockComunidadesRepository.create).toHaveBeenCalledWith(dto);
      expect(mockComunidadesRepository.save).toHaveBeenCalledWith(comunidadeCriada);
    });
  });

  describe('findAll', () => {
    const paginatedResult = {
      items: [{ id: '123', nome: 'Comunidade Teste' }],
      meta: { totalItems: 1, itemCount: 1, itemsPerPage: 10, totalPages: 1, currentPage: 1 },
    };

    it('deve retornar uma lista paginada sem filtros', async () => {
      const paginationDto = { page: 1, limit: 10 };
      (paginateModule.paginate as jest.Mock).mockResolvedValue(paginatedResult);

      const resultado = await service.findAll(paginationDto);

      expect(resultado).toEqual(paginatedResult);
      expect(paginateModule.paginate).toHaveBeenCalledWith(
        mockComunidadesRepository,
        { page: 1, limit: 10 },
        { where: {}, relations: ['paroquia', 'cidade', 'horarios_missa'] }
      );
    });

    it('deve retornar uma lista paginada aplicando filtros de cidadeId e nome', async () => {
      const paginationDto = { page: 1, limit: 10 };
      (paginateModule.paginate as jest.Mock).mockResolvedValue(paginatedResult);

      const resultado = await service.findAll(paginationDto, 'cidade-123', 'Nome Teste');

      expect(resultado).toEqual(paginatedResult);
      expect(paginateModule.paginate).toHaveBeenCalledWith(
        mockComunidadesRepository,
        { page: 1, limit: 10 },
        { where: { cidade_id: 'cidade-123', nome: 'Nome Teste' }, relations: ['paroquia', 'cidade', 'horarios_missa'] }
      );
    });
  });

  describe('findOne', () => {
    it('deve retornar uma comunidade se o ID existir', async () => {
      const comunidadeEsperada = { id: '123', nome: 'Comunidade Teste' };
      mockComunidadesRepository.findOne.mockResolvedValue(comunidadeEsperada);

      const resultado = await service.findOne('123');

      expect(resultado).toEqual(comunidadeEsperada);
      expect(mockComunidadesRepository.findOne).toHaveBeenCalledWith({
        where: { id: '123' },
        relations: ['paroquia', 'cidade', 'horarios_missa'],
      });
    });

    it('deve lançar um NotFoundException se a comunidade não existir', async () => {
      mockComunidadesRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('deve atualizar a comunidade se ela existir', async () => {
      const dto = { nome: 'Comunidade Atualizada' };
      const preloaded = { id: '123', nome: 'Comunidade Atualizada' };

      mockComunidadesRepository.preload.mockResolvedValue(preloaded);
      mockComunidadesRepository.save.mockResolvedValue(preloaded);

      const resultado = await service.update('123', dto);

      expect(resultado).toEqual(preloaded);
      expect(mockComunidadesRepository.preload).toHaveBeenCalledWith({ id: '123', ...dto });
      expect(mockComunidadesRepository.save).toHaveBeenCalledWith(preloaded);
    });

    it('deve lançar um NotFoundException se tentar atualizar uma comunidade que não existe', async () => {
      const dto = { nome: 'Inexistente' };
      mockComunidadesRepository.preload.mockResolvedValue(null);

      await expect(service.update('999', dto)).rejects.toThrow(NotFoundException);
      expect(mockComunidadesRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('deve remover logicamente (softRemove) a comunidade', async () => {
      const comunidadeEsperada = { id: '123', nome: 'Comunidade Teste' };

      mockComunidadesRepository.findOne.mockResolvedValue(comunidadeEsperada);
      mockComunidadesRepository.softRemove.mockResolvedValue(comunidadeEsperada);

      const resultado = await service.remove('123');

      expect(resultado).toEqual(comunidadeEsperada);
      expect(mockComunidadesRepository.softRemove).toHaveBeenCalledWith(comunidadeEsperada);
    });

    it('deve lançar um NotFoundException se tentar remover uma comunidade que não existe', async () => {
      mockComunidadesRepository.findOne.mockResolvedValue(null);
      await expect(service.remove('999')).rejects.toThrow(NotFoundException);
      expect(mockComunidadesRepository.softRemove).not.toHaveBeenCalled();
    });
  });
});
