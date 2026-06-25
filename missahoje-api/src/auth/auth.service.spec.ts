import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsuariosService } from '../usuarios/usuarios.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;

  const mockUsuariosService = {
    validateCredentials: jest.fn(),
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
      const usuarioValido = { id: '1', email: 'test@test.com', role: 'USER' };
      mockUsuariosService.validateCredentials.mockResolvedValue(usuarioValido);

      const resultado = await service.validateUser({ email: 'test@test.com', senha: '123' });

      expect(resultado).toEqual(usuarioValido);
      expect(mockUsuariosService.validateCredentials).toHaveBeenCalledWith('test@test.com', '123');
    });

    it('deve retornar null se as credenciais forem inválidas', async () => {
      mockUsuariosService.validateCredentials.mockResolvedValue(null);

      const resultado = await service.validateUser({ email: 'wrong@test.com', senha: '123' });

      expect(resultado).toBeNull();
    });
  });

  describe('authenticate', () => {
    it('deve gerar e retornar o token se validado com sucesso', async () => {
      const usuarioValido = { id: '1', email: 'test@test.com', role: 'USER' };
      
      mockUsuariosService.validateCredentials.mockResolvedValue(usuarioValido);
      mockJwtService.signAsync.mockResolvedValue('token-jwt-aqui');

      const resultado = await service.authenticate({ email: 'test@test.com', senha: '123' });

      expect(resultado).toEqual({ access_token: 'token-jwt-aqui' });
    });

    it('deve lançar UnauthorizedException se validateUser falhar', async () => {
      mockUsuariosService.validateCredentials.mockResolvedValue(null);

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
