import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { ParoquiaService } from './paroquia.service';
import { Paroquia } from './entities/paroquia.entity';
import * as paginateModule from 'nestjs-typeorm-paginate';

jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn(),
}));

describe('ParoquiaService', () => {
  let service: ParoquiaService;

  const mockQueryBuilder = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
  };

  const mockParoquiaRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    preload: jest.fn(),
    softRemove: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParoquiaService,
        {
          provide: getRepositoryToken(Paroquia),
          useValue: mockParoquiaRepository,
        },
      ],
    }).compile();

    service = module.get<ParoquiaService>(ParoquiaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deve criar uma nova paroquia', async () => {
      const dto = { nome: 'Paróquia Teste' };
      const paroquiaCriada = { id: '123', ...dto };

      mockParoquiaRepository.create.mockReturnValue(paroquiaCriada);
      mockParoquiaRepository.save.mockResolvedValue(paroquiaCriada);

      const resultado = await service.create(dto);

      expect(resultado).toEqual(paroquiaCriada);
      expect(mockParoquiaRepository.create).toHaveBeenCalledWith(dto);
      expect(mockParoquiaRepository.save).toHaveBeenCalledWith(paroquiaCriada);
    });
  });

  describe('findAll', () => {
    const paginatedResult = {
      items: [{ id: '123', nome: 'Paróquia Teste' }],
      meta: { totalItems: 1, itemCount: 1, itemsPerPage: 10, totalPages: 1, currentPage: 1 },
    };

    it('deve retornar uma lista paginada sem filtros', async () => {
      const paginationDto = { page: 1, limit: 10 };
      (paginateModule.paginate as jest.Mock).mockResolvedValue(paginatedResult);

      const resultado = await service.findAll(paginationDto);

      expect(resultado).toEqual(paginatedResult);
      expect(mockParoquiaRepository.createQueryBuilder).toHaveBeenCalledWith('paroquia');
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith('paroquia.comunidades', 'comunidade');
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith('comunidade.cidade', 'cidade');
      expect(mockQueryBuilder.andWhere).not.toHaveBeenCalled();
      expect(paginateModule.paginate).toHaveBeenCalledWith(mockQueryBuilder, { page: 1, limit: 10 });
    });

    it('deve retornar uma lista paginada aplicando os filtros opcionais de nome e cidadeId', async () => {
      const paginationDto = { page: 1, limit: 10 };
      (paginateModule.paginate as jest.Mock).mockResolvedValue(paginatedResult);

      const resultado = await service.findAll(paginationDto, 'cidade-123', 'Nome Teste');

      expect(resultado).toEqual(paginatedResult);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('paroquia.nome ILIKE :nome', { nome: '%Nome Teste%' });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('comunidade.cidade_id = :cidadeId', { cidadeId: 'cidade-123' });
      expect(paginateModule.paginate).toHaveBeenCalledWith(mockQueryBuilder, { page: 1, limit: 10 });
    });
  });

  describe('findOne', () => {
    it('deve retornar uma paróquia se o ID existir', async () => {
      const paroquiaEsperada = { id: '123', nome: 'Paróquia Teste' };
      mockParoquiaRepository.findOne.mockResolvedValue(paroquiaEsperada);

      const resultado = await service.findOne('123');

      expect(resultado).toEqual(paroquiaEsperada);
      expect(mockParoquiaRepository.findOne).toHaveBeenCalledWith({
        where: { id: '123' },
        relations: ['comunidades'],
      });
    });

    it('deve lançar um NotFoundException se a paróquia não existir', async () => {
      mockParoquiaRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('deve atualizar a paróquia se ela existir', async () => {
      const dto = { nome: 'Paróquia Atualizada' };
      const preloaded = { id: '123', nome: 'Paróquia Atualizada' };

      mockParoquiaRepository.preload.mockResolvedValue(preloaded);
      mockParoquiaRepository.save.mockResolvedValue(preloaded);

      const resultado = await service.update('123', dto);

      expect(resultado).toEqual(preloaded);
      expect(mockParoquiaRepository.preload).toHaveBeenCalledWith({ id: '123', ...dto });
      expect(mockParoquiaRepository.save).toHaveBeenCalledWith(preloaded);
    });

    it('deve lançar um NotFoundException se tentar atualizar uma paróquia que não existe', async () => {
      const dto = { nome: 'Inexistente' };
      mockParoquiaRepository.preload.mockResolvedValue(null);

      await expect(service.update('999', dto)).rejects.toThrow(NotFoundException);
      expect(mockParoquiaRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('deve remover logicamente (softRemove) a paróquia', async () => {
      const paroquiaEsperada = { id: '123', nome: 'Paróquia Teste' };

      mockParoquiaRepository.findOne.mockResolvedValue(paroquiaEsperada);
      mockParoquiaRepository.softRemove.mockResolvedValue(paroquiaEsperada);

      const resultado = await service.remove('123');

      expect(resultado).toEqual(paroquiaEsperada);
      expect(mockParoquiaRepository.softRemove).toHaveBeenCalledWith(paroquiaEsperada);
    });

    it('deve lançar um NotFoundException se tentar remover uma paróquia que não existe', async () => {
      mockParoquiaRepository.findOne.mockResolvedValue(null);
      await expect(service.remove('999')).rejects.toThrow(NotFoundException);
      expect(mockParoquiaRepository.softRemove).not.toHaveBeenCalled();
    });
  });
});
