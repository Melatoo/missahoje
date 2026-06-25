import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MissasRepository } from './missas.repository';
import { HorarioMissa } from './entities/horario-missa.entity';
import * as paginateModule from 'nestjs-typeorm-paginate';

jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn(),
}));

describe('MissasRepository', () => {
  let repository: MissasRepository;

  const mockQueryBuilder = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
  };

  const mockTypeOrmRepository = {
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
        MissasRepository,
        {
          provide: getRepositoryToken(HorarioMissa),
          useValue: mockTypeOrmRepository,
        },
      ],
    }).compile();

    repository = module.get<MissasRepository>(MissasRepository);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findWithFilters', () => {
    const paginatedResult = {
      items: [{ id: '123', horario: '10:00' }],
      meta: { totalItems: 1, itemCount: 1, itemsPerPage: 10, totalPages: 1, currentPage: 1 },
    };

    it('deve retornar a lista base sem filtros', async () => {
      const queryDto = { page: 1, limit: 10 };
      (paginateModule.paginate as jest.Mock).mockResolvedValue(paginatedResult);

      const resultado = await repository.findWithFilters(queryDto);

      expect(resultado).toEqual(paginatedResult);
      expect(mockTypeOrmRepository.createQueryBuilder).toHaveBeenCalledWith('horario');
      expect(mockQueryBuilder.andWhere).not.toHaveBeenCalled();
      expect(paginateModule.paginate).toHaveBeenCalledWith(mockQueryBuilder, { page: 1, limit: 10 });
    });

    it('deve retornar a lista aplicando o filtro de dia da semana (0 é domingo)', async () => {
      const queryDto = { page: 1, limit: 10, dia_semana: 0 };
      (paginateModule.paginate as jest.Mock).mockResolvedValue(paginatedResult);

      await repository.findWithFilters(queryDto);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('horario.dia_semana = :dia_semana', { dia_semana: 0 });
    });

    it('deve retornar a lista aplicando o filtro de bairro', async () => {
      const queryDto = { page: 1, limit: 10, bairro: 'Centro' };
      (paginateModule.paginate as jest.Mock).mockResolvedValue(paginatedResult);

      await repository.findWithFilters(queryDto);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('comunidade.bairro ILIKE :bairro', { bairro: '%Centro%' });
    });

    it('deve retornar a lista aplicando o filtro de cidadeId', async () => {
      const queryDto = { page: 1, limit: 10, cidadeId: '123' };
      (paginateModule.paginate as jest.Mock).mockResolvedValue(paginatedResult);

      await repository.findWithFilters(queryDto);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('comunidade.cidade_id = :cidadeId', { cidadeId: '123' });
    });
  });

  describe('Delegação para o TypeORM', () => {
    it('deve delegar o create', () => {
      const dto = { horario: '10:00' };
      repository.create(dto);
      expect(mockTypeOrmRepository.create).toHaveBeenCalledWith(dto);
    });

    it('deve delegar o save', async () => {
      const data = { id: '1', horario: '10:00' } as any;
      await repository.save(data);
      expect(mockTypeOrmRepository.save).toHaveBeenCalledWith(data);
    });

    it('deve delegar o findOne', async () => {
      await repository.findOne({ where: { id: '1' } });
      expect(mockTypeOrmRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('deve delegar o preload', async () => {
      const dto = { id: '1' };
      await repository.preload(dto);
      expect(mockTypeOrmRepository.preload).toHaveBeenCalledWith(dto);
    });

    it('deve delegar o softRemove', async () => {
      const data = { id: '1' } as any;
      await repository.softRemove(data);
      expect(mockTypeOrmRepository.softRemove).toHaveBeenCalledWith(data);
    });
  });
});
