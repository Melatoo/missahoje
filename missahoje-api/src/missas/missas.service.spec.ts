import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { MissasService } from './missas.service';
import { MissasRepository } from './missas.repository';

describe('MissasService', () => {
  let service: MissasService;

  const mockMissasRepository = {
    findWithFilters: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    preload: jest.fn(),
    softRemove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MissasService,
        {
          provide: MissasRepository,
          useValue: mockMissasRepository,
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

      mockMissasRepository.create.mockReturnValue(missaCriada);
      mockMissasRepository.save.mockResolvedValue(missaCriada);

      const resultado = await service.create(dto as any);

      expect(resultado).toEqual(missaCriada);
      expect(mockMissasRepository.create).toHaveBeenCalledWith(dto);
      expect(mockMissasRepository.save).toHaveBeenCalledWith(missaCriada);
    });
  });

  describe('findAll', () => {
    it('deve delegar para o repositório', async () => {
      const queryDto = { page: 1, limit: 10, dia_semana: 0 };
      const paginatedResult = { items: [{ id: '123' }], meta: {} };

      mockMissasRepository.findWithFilters.mockResolvedValue(paginatedResult);

      const resultado = await service.findAll(queryDto);

      expect(resultado).toEqual(paginatedResult);
      expect(mockMissasRepository.findWithFilters).toHaveBeenCalledWith(queryDto);
    });
  });

  describe('findOne', () => {
    it('deve retornar a missa se o ID existir', async () => {
      const missaEsperada = { id: '123', horario: '10:00' };
      mockMissasRepository.findOne.mockResolvedValue(missaEsperada);

      const resultado = await service.findOne('123');

      expect(resultado).toEqual(missaEsperada);
      expect(mockMissasRepository.findOne).toHaveBeenCalledWith({
        where: { id: '123' },
        relations: ['comunidade', 'comunidade.paroquia'],
      });
    });

    it('deve lançar um NotFoundException se a missa não existir', async () => {
      mockMissasRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('deve atualizar a missa se ela existir', async () => {
      const dto = { horario: '11:00' };
      const preloaded = { id: '123', horario: '11:00' };

      mockMissasRepository.preload.mockResolvedValue(preloaded);
      mockMissasRepository.save.mockResolvedValue(preloaded);

      const resultado = await service.update('123', dto);

      expect(resultado).toEqual(preloaded);
      expect(mockMissasRepository.preload).toHaveBeenCalledWith({ id: '123', ...dto });
      expect(mockMissasRepository.save).toHaveBeenCalledWith(preloaded);
    });

    it('deve lançar um NotFoundException se tentar atualizar missa que não existe', async () => {
      mockMissasRepository.preload.mockResolvedValue(null);
      await expect(service.update('999', {})).rejects.toThrow(NotFoundException);
      expect(mockMissasRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('deve remover logicamente a missa', async () => {
      const missaEsperada = { id: '123', horario: '10:00' };

      mockMissasRepository.findOne.mockResolvedValue(missaEsperada);
      mockMissasRepository.softRemove.mockResolvedValue(missaEsperada);

      const resultado = await service.remove('123');

      expect(resultado).toEqual(missaEsperada);
      expect(mockMissasRepository.softRemove).toHaveBeenCalledWith(missaEsperada);
    });

    it('deve lançar um NotFoundException se tentar remover missa inexistente', async () => {
      mockMissasRepository.findOne.mockResolvedValue(null);
      await expect(service.remove('999')).rejects.toThrow(NotFoundException);
    });
  });
});
