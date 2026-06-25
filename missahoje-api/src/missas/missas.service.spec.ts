import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { MissasService } from './missas.service';
import { HorarioMissa } from './entities/horario-missa.entity';
import * as paginateModule from 'nestjs-typeorm-paginate';

jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn(),
}));

describe('MissasService', () => {
  let service: MissasService;

  const mockQueryBuilder = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
  };

  const mockHorarioMissaRepository = {
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
        MissasService,
        {
          provide: getRepositoryToken(HorarioMissa),
          useValue: mockHorarioMissaRepository,
        },
      ],
    }).compile();

    service = module.get<MissasService>(MissasService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deve criar um novo horário de missa', async () => {
      const dto = { dia_semana: 0, horario: '10:00', comunidade_id: '1' };
      const missaCriada = { id: '123', ...dto };

      mockHorarioMissaRepository.create.mockReturnValue(missaCriada);
      mockHorarioMissaRepository.save.mockResolvedValue(missaCriada);

      const resultado = await service.create(dto as any);

      expect(resultado).toEqual(missaCriada);
      expect(mockHorarioMissaRepository.create).toHaveBeenCalledWith(dto);
      expect(mockHorarioMissaRepository.save).toHaveBeenCalledWith(missaCriada);
    });
  });

  describe('findAll', () => {
    const paginatedResult = {
      items: [{ id: '123', horario: '10:00' }],
      meta: { totalItems: 1, itemCount: 1, itemsPerPage: 10, totalPages: 1, currentPage: 1 },
    };

    it('deve retornar a lista base sem filtros', async () => {
      const queryDto = { page: 1, limit: 10 };
      (paginateModule.paginate as jest.Mock).mockResolvedValue(paginatedResult);

      const resultado = await service.findAll(queryDto);

      expect(resultado).toEqual(paginatedResult);
      expect(mockHorarioMissaRepository.createQueryBuilder).toHaveBeenCalledWith('horario');
      expect(mockQueryBuilder.andWhere).not.toHaveBeenCalled();
      expect(paginateModule.paginate).toHaveBeenCalledWith(mockQueryBuilder, { page: 1, limit: 10 });
    });

    it('deve retornar a lista aplicando o filtro de dia da semana (0 é domingo)', async () => {
      const queryDto = { page: 1, limit: 10, dia_semana: 0 };
      (paginateModule.paginate as jest.Mock).mockResolvedValue(paginatedResult);

      await service.findAll(queryDto);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('horario.dia_semana = :dia_semana', { dia_semana: 0 });
    });

    it('deve retornar a lista aplicando o filtro de bairro', async () => {
      const queryDto = { page: 1, limit: 10, bairro: 'Centro' };
      (paginateModule.paginate as jest.Mock).mockResolvedValue(paginatedResult);

      await service.findAll(queryDto);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('comunidade.bairro ILIKE :bairro', { bairro: '%Centro%' });
    });

    it('deve retornar a lista aplicando o filtro de cidadeId', async () => {
      const queryDto = { page: 1, limit: 10, cidadeId: '123' };
      (paginateModule.paginate as jest.Mock).mockResolvedValue(paginatedResult);

      await service.findAll(queryDto);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('comunidade.cidade_id = :cidadeId', { cidadeId: '123' });
    });
  });

  describe('findOne', () => {
    it('deve retornar a missa se o ID existir', async () => {
      const missaEsperada = { id: '123', horario: '10:00' };
      mockHorarioMissaRepository.findOne.mockResolvedValue(missaEsperada);

      const resultado = await service.findOne('123');

      expect(resultado).toEqual(missaEsperada);
      expect(mockHorarioMissaRepository.findOne).toHaveBeenCalledWith({
        where: { id: '123' },
        relations: ['comunidade', 'comunidade.paroquia'],
      });
    });

    it('deve lançar um NotFoundException se a missa não existir', async () => {
      mockHorarioMissaRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('deve atualizar a missa se ela existir', async () => {
      const dto = { horario: '11:00' };
      const preloaded = { id: '123', horario: '11:00' };

      mockHorarioMissaRepository.preload.mockResolvedValue(preloaded);
      mockHorarioMissaRepository.save.mockResolvedValue(preloaded);

      const resultado = await service.update('123', dto);

      expect(resultado).toEqual(preloaded);
      expect(mockHorarioMissaRepository.preload).toHaveBeenCalledWith({ id: '123', ...dto });
      expect(mockHorarioMissaRepository.save).toHaveBeenCalledWith(preloaded);
    });

    it('deve lançar um NotFoundException se tentar atualizar missa que não existe', async () => {
      mockHorarioMissaRepository.preload.mockResolvedValue(null);
      await expect(service.update('999', {})).rejects.toThrow(NotFoundException);
      expect(mockHorarioMissaRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('deve remover logicamente a missa', async () => {
      const missaEsperada = { id: '123', horario: '10:00' };

      mockHorarioMissaRepository.findOne.mockResolvedValue(missaEsperada);
      mockHorarioMissaRepository.softRemove.mockResolvedValue(missaEsperada);

      const resultado = await service.remove('123');

      expect(resultado).toEqual(missaEsperada);
      expect(mockHorarioMissaRepository.softRemove).toHaveBeenCalledWith(missaEsperada);
    });

    it('deve lançar um NotFoundException se tentar remover missa inexistente', async () => {
      mockHorarioMissaRepository.findOne.mockResolvedValue(null);
      await expect(service.remove('999')).rejects.toThrow(NotFoundException);
    });
  });
});
