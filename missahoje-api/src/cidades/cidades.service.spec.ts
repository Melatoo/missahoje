import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
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
    findOne: jest.fn(),
    preload: jest.fn(),
    softRemove: jest.fn(),
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
      const dto = { nome: 'Lavras', estado: 'MG' };
      const cidadeCriada = { id: '123', ...dto };

      mockCidadesRepository.create.mockReturnValue(cidadeCriada);
      mockCidadesRepository.save.mockResolvedValue(cidadeCriada);

      const resultado = await service.create(dto);

      expect(resultado).toEqual(cidadeCriada);
      expect(mockCidadesRepository.create).toHaveBeenCalledWith(dto);
      expect(mockCidadesRepository.save).toHaveBeenCalledWith(cidadeCriada);
    });
  });

  describe('findAll', () => {
    it('deve retornar uma lista paginada de cidades', async () => {
      const paginationDto = { page: 1, limit: 10 };
      const paginatedResult = {
        items: [{ id: '123', nome: 'Lavras', estado: 'MG' }],
        meta: { totalItems: 1, itemCount: 1, itemsPerPage: 10, totalPages: 1, currentPage: 1 },
      };

      (paginateModule.paginate as jest.Mock).mockResolvedValue(paginatedResult);

      const resultado = await service.findAll(paginationDto);

      expect(resultado).toEqual(paginatedResult);
      expect(paginateModule.paginate).toHaveBeenCalledWith(mockCidadesRepository, {
        page: 1,
        limit: 10,
      });
    });
  });

  describe('findOne', () => {
    it('deve retornar uma cidade se o ID existir', async () => {
      const cidadeEsperada = { id: '123', nome: 'Lavras', estado: 'MG' };

      mockCidadesRepository.findOne.mockResolvedValue(cidadeEsperada);

      const resultado = await service.findOne('123');

      expect(resultado).toEqual(cidadeEsperada);
      expect(mockCidadesRepository.findOne).toHaveBeenCalledWith({ where: { id: '123' } });
    });

    it('deve lançar um NotFoundException se a cidade não existir', async () => {
      mockCidadesRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('deve atualizar a cidade se ela existir', async () => {
      const dto = { nome: 'Lavras Atualizada' };
      const cidadePreloaded = { id: '123', nome: 'Lavras Atualizada', estado: 'MG' };

      mockCidadesRepository.preload.mockResolvedValue(cidadePreloaded);
      mockCidadesRepository.save.mockResolvedValue(cidadePreloaded);

      const resultado = await service.update('123', dto);

      expect(resultado).toEqual(cidadePreloaded);
      expect(mockCidadesRepository.preload).toHaveBeenCalledWith({ id: '123', ...dto });
      expect(mockCidadesRepository.save).toHaveBeenCalledWith(cidadePreloaded);
    });

    it('deve lançar um NotFoundException se tentar atualizar uma cidade que não existe', async () => {
      const dto = { nome: 'Inexistente' };

      mockCidadesRepository.preload.mockResolvedValue(null);

      await expect(service.update('999', dto)).rejects.toThrow(NotFoundException);
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
      expect(mockCidadesRepository.findOne).toHaveBeenCalledWith({ where: { id: '123' } });
      expect(mockCidadesRepository.softRemove).toHaveBeenCalledWith(cidadeEsperada);
    });

    it('deve lançar um NotFoundException se tentar remover uma cidade que não existe', async () => {
      mockCidadesRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('999')).rejects.toThrow(NotFoundException);
      expect(mockCidadesRepository.softRemove).not.toHaveBeenCalled();
    });
  });
});

