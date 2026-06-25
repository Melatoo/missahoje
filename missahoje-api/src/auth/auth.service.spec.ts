import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsuariosService } from '../usuarios/usuarios.service';
import { JwtService } from '@nestjs/jwt';
import bcryptjs from 'bcryptjs';

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;

  const mockUsuariosService = {
    findByEmailWithPassword: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsuariosService,
          useValue: mockUsuariosService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('deve retornar o usuário (sem a senha) se as credenciais forem válidas', async () => {
      const usuarioBanco = { id: '1', email: 'test@test.com', senha: 'hash', role: 'USER' };
      mockUsuariosService.findByEmailWithPassword.mockResolvedValue(usuarioBanco);
      (bcryptjs.compare as jest.Mock).mockResolvedValue(true);

      const resultado = await service.validateUser({ email: 'test@test.com', senha: '123' });

      expect(resultado).toEqual({ id: '1', email: 'test@test.com', role: 'USER' });
      expect(mockUsuariosService.findByEmailWithPassword).toHaveBeenCalledWith('test@test.com');
      expect(bcryptjs.compare).toHaveBeenCalledWith('123', 'hash');
    });

    it('deve retornar null se o email não existir', async () => {
      mockUsuariosService.findByEmailWithPassword.mockResolvedValue(null);

      const resultado = await service.validateUser({ email: 'wrong@test.com', senha: '123' });

      expect(resultado).toBeNull();
      expect(bcryptjs.compare).not.toHaveBeenCalled();
    });

    it('deve retornar null se a senha estiver incorreta', async () => {
      const usuarioBanco = { id: '1', email: 'test@test.com', senha: 'hash', role: 'USER' };
      mockUsuariosService.findByEmailWithPassword.mockResolvedValue(usuarioBanco);
      (bcryptjs.compare as jest.Mock).mockResolvedValue(false);

      const resultado = await service.validateUser({ email: 'test@test.com', senha: 'wrong' });

      expect(resultado).toBeNull();
    });
  });

  describe('authenticate', () => {
    it('deve gerar e retornar o token se validado com sucesso', async () => {
      const usuarioValido = { id: '1', email: 'test@test.com', role: 'USER' };
      
      // Como authenticate chama validateUser e signIn da mesma classe,
      // podemos mockar as chamadas através de spyOn no próprio service,
      // ou apenas mockar os serviços internos para o fluxo inteiro.
      // O mais realista é testar o fluxo (integração das partes no service).
      mockUsuariosService.findByEmailWithPassword.mockResolvedValue({ ...usuarioValido, senha: '123' });
      (bcryptjs.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue('token-jwt-aqui');

      const resultado = await service.authenticate({ email: 'test@test.com', senha: '123' });

      expect(resultado).toEqual({ access_token: 'token-jwt-aqui' });
    });

    it('deve lançar UnauthorizedException se validateUser falhar', async () => {
      mockUsuariosService.findByEmailWithPassword.mockResolvedValue(null);

      await expect(service.authenticate({ email: 'test@test.com', senha: '123' }))
        .rejects.toThrow(UnauthorizedException);
    });
  });

  describe('signIn', () => {
    it('deve assinar e retornar o token', async () => {
      const usuario = { id: '1', email: 'test@test.com', role: 'USER' };
      mockJwtService.signAsync.mockResolvedValue('token-jwt-aqui');

      const resultado = await service.signIn(usuario as any);

      expect(resultado).toEqual({ access_token: 'token-jwt-aqui' });
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        sub: '1',
        email: 'test@test.com',
        role: 'USER',
      });
    });
  });
});
