import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { Usuario } from './entities/usuario.entity';
import * as paginateModule from 'nestjs-typeorm-paginate';
import bcryptjs from 'bcryptjs';

jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn(),
}));

jest.mock('bcryptjs', () => ({
  genSalt: jest.fn().mockResolvedValue('salt'),
  hash: jest.fn().mockResolvedValue('hashed_password'),
}));

describe('UsuariosService', () => {
  let service: UsuariosService;

  const mockQueryBuilder = {
    addSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
  };

  const mockUsuariosRepository = {
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
        UsuariosService,
        {
          provide: getRepositoryToken(Usuario),
          useValue: mockUsuariosRepository,
        },
      ],
    }).compile();

    service = module.get<UsuariosService>(UsuariosService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deve criar um novo usuário com senha em hash', async () => {
      const dto = { email: 'teste@teste.com', senha: '123', nome: 'Teste' };
      const usuarioCriado = { id: '123', ...dto };

      mockUsuariosRepository.findOne.mockResolvedValue(null); // findByEmail
      mockUsuariosRepository.create.mockReturnValue(usuarioCriado);
      mockUsuariosRepository.save.mockResolvedValue(usuarioCriado);

      const resultado = await service.create(dto as any);

      expect(bcryptjs.genSalt).toHaveBeenCalled();
      expect(bcryptjs.hash).toHaveBeenCalledWith('123', 'salt');
      expect(resultado.senha).toEqual('hashed_password');
      expect(mockUsuariosRepository.save).toHaveBeenCalled();
    });

    it('deve lançar ConflictException se o email já estiver cadastrado', async () => {
      const dto = { email: 'existente@teste.com', senha: '123', nome: 'Teste' };

      mockUsuariosRepository.findOne.mockResolvedValue({ id: '123', email: 'existente@teste.com' });

      await expect(service.create(dto as any)).rejects.toThrow(ConflictException);
      expect(mockUsuariosRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('deve retornar a lista paginada', async () => {
      const paginationDto = { page: 1, limit: 10 };
      const paginatedResult = { items: [], meta: {} };

      (paginateModule.paginate as jest.Mock).mockResolvedValue(paginatedResult);

      const resultado = await service.findAll(paginationDto);
      expect(resultado).toEqual(paginatedResult);
      expect(paginateModule.paginate).toHaveBeenCalledWith(mockUsuariosRepository, { page: 1, limit: 10 });
    });
  });

  describe('findOne', () => {
    it('deve retornar o usuário se existir', async () => {
      const usuario = { id: '123' };
      mockUsuariosRepository.findOne.mockResolvedValue(usuario);

      const resultado = await service.findOne('123');
      expect(resultado).toEqual(usuario);
    });

    it('deve lançar NotFoundException se não existir', async () => {
      mockUsuariosRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByEmail', () => {
    it('deve retornar o usuário pelo email', async () => {
      const usuario = { email: 'teste@teste.com' };
      mockUsuariosRepository.findOne.mockResolvedValue(usuario);

      const resultado = await service.findByEmail('teste@teste.com');
      expect(resultado).toEqual(usuario);
      expect(mockUsuariosRepository.findOne).toHaveBeenCalledWith({ where: { email: 'teste@teste.com' } });
    });
  });

  describe('findByEmailWithPassword', () => {
    it('deve buscar usuário com senha no queryBuilder', async () => {
      const usuario = { email: 'teste@teste.com', senha: 'hash' };
      mockQueryBuilder.getOne.mockResolvedValue(usuario);

      const resultado = await service.findByEmailWithPassword('teste@teste.com');
      
      expect(resultado).toEqual(usuario);
      expect(mockUsuariosRepository.createQueryBuilder).toHaveBeenCalledWith('usuarios');
      expect(mockQueryBuilder.addSelect).toHaveBeenCalledWith('usuarios.senha');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('usuarios.email = :email', { email: 'teste@teste.com' });
      expect(mockQueryBuilder.getOne).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('deve atualizar um usuário (sem mexer na senha)', async () => {
      const preloaded = { id: '123', nome: 'Novo Nome' };
      mockUsuariosRepository.preload.mockResolvedValue(preloaded);
      mockUsuariosRepository.save.mockResolvedValue(preloaded);

      const resultado = await service.update('123', { nome: 'Novo Nome' });

      expect(resultado).toEqual(preloaded);
      expect(bcryptjs.hash).not.toHaveBeenCalled(); // Pois não mandamos senha
      expect(mockUsuariosRepository.save).toHaveBeenCalledWith(preloaded);
    });

    it('deve atualizar a senha usando hash se ela for enviada', async () => {
      const preloaded = { id: '123', senha: 'nova' };
      mockUsuariosRepository.preload.mockResolvedValue(preloaded);
      mockUsuariosRepository.save.mockResolvedValue(preloaded);

      await service.update('123', { senha: 'nova' });

      expect(bcryptjs.genSalt).toHaveBeenCalled();
      expect(bcryptjs.hash).toHaveBeenCalledWith('nova', 'salt');
      expect(preloaded.senha).toEqual('hashed_password');
      expect(mockUsuariosRepository.save).toHaveBeenCalledWith(preloaded);
    });

    it('deve lançar NotFoundException se o usuário não for encontrado', async () => {
      mockUsuariosRepository.preload.mockResolvedValue(null);
      await expect(service.update('999', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('deve remover logicamente o usuário', async () => {
      const usuario = { id: '123' };
      mockUsuariosRepository.findOne.mockResolvedValue(usuario);
      mockUsuariosRepository.softRemove.mockResolvedValue(usuario);

      const resultado = await service.remove('123');

      expect(resultado).toEqual(usuario);
    });
  });
});
