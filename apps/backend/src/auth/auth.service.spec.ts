import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should return user without password when credentials are valid', () => {
      const result = service.validateUser('user@example.com', 'password');

      expect(result).toEqual({
        id: '1',
        email: 'user@example.com',
      });
    });

    it('should return null when email is invalid', () => {
      const result = service.validateUser('invalid@example.com', 'password');

      expect(result).toBeNull();
    });

    it('should return null when password is invalid', () => {
      const result = service.validateUser('user@example.com', 'wrong-password');

      expect(result).toBeNull();
    });

    it('should return null when email is undefined', () => {
      const result = service.validateUser(undefined, 'password');

      expect(result).toBeNull();
    });

    it('should return null when password is undefined', () => {
      const result = service.validateUser('user@example.com', undefined);

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return a token when credentials are valid', () => {
      const mockToken = 'mock.jwt.token';
      mockJwtService.sign.mockReturnValue(mockToken);

      const loginDto = {
        email: 'user@example.com',
        password: 'password',
      };

      const result = service.login(loginDto);

      expect(result).toEqual({ token: mockToken });
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: '1',
        email: 'user@example.com',
      });
    });

    it('should throw UnauthorizedException when credentials are invalid', () => {
      const loginDto = {
        email: 'invalid@example.com',
        password: 'wrong-password',
      };

      expect(() => service.login(loginDto)).toThrow(UnauthorizedException);
      expect(() => service.login(loginDto)).toThrow('Invalid credentials');
    });

    it('should throw UnauthorizedException when dto is undefined', () => {
      expect(() => service.login(undefined)).toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when email is missing', () => {
      const loginDto = {
        email: '',
        password: 'password',
      };

      expect(() => service.login(loginDto)).toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when password is missing', () => {
      const loginDto = {
        email: 'user@example.com',
        password: '',
      };

      expect(() => service.login(loginDto)).toThrow(UnauthorizedException);
    });
  });
});
