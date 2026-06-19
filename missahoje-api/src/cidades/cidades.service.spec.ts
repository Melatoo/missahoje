import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { CidadesService } from './cidades.service';
import { Cidade } from './entities/cidade.entity';

describe('CidadesService', () => {
  let service: CidadesService;
  
  // Vamos criar um objeto falso para simular nosso banco de dados
  const mockCidadesRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    // vamos adicionar outros métodos depois conforme precisarmos
  };

  // O beforeEach roda antes de cada teste ('it')
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CidadesService,
        // Aqui nós dizemos ao Nest: "Sempre que alguém pedir o Repositório de Cidade, entregue nosso mockCidadesRepository"
        {
          provide: getRepositoryToken(Cidade),
          useValue: mockCidadesRepository,
        },
      ],
    }).compile();

    service = module.get<CidadesService>(CidadesService);
  });

  it('should be defined', () => {
    // Este é um teste simples apenas para garantir que o service foi instanciado com sucesso
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('deve retornar uma cidade se o ID existir', async () => {
      // 1. O que esperamos que o mock retorne:
      const cidadeEsperada = { id: '123', nome: 'Lavras', estado: 'MG' };
      
      // 2. Forçamos o mock a retornar os dados
      mockCidadesRepository.findOne.mockResolvedValue(cidadeEsperada);

      // 3. Chamamos a função do nosso service
      const resultado = await service.findOne('123');

      // 4. Verificamos se o resultado bate e se o repositório foi chamado corretamente
      expect(resultado).toEqual(cidadeEsperada);
      expect(mockCidadesRepository.findOne).toHaveBeenCalledWith({ where: { id: '123' } });
    });

    it('deve lançar um NotFoundException se a cidade não existir', async () => {
      // 1. Forçamos o mock a retornar 'null' (simulando que não achou no banco)
      mockCidadesRepository.findOne.mockResolvedValue(null);

      // 2. Verificamos se a chamada do método joga a exceção corretamente
      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });
});
