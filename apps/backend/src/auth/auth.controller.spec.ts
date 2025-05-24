import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return a token when valid credentials are provided', () => {
      const loginDto: LoginDto = {
        email: 'user@example.com',
        password: 'password',
      };
      const expectedResponse = { token: 'mock.jwt.token' };

      mockAuthService.login.mockReturnValue(expectedResponse);

      const result = controller.login(loginDto);

      expect(result).toEqual(expectedResponse);
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });

    it('should throw UnauthorizedException when invalid credentials are provided', () => {
      const loginDto: LoginDto = {
        email: 'invalid@example.com',
        password: 'wrong-password',
      };

      mockAuthService.login.mockImplementation(() => {
        throw new UnauthorizedException('Invalid credentials');
      });

      expect(() => controller.login(loginDto)).toThrow(UnauthorizedException);
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });

    it('should handle undefined loginDto', () => {
      const expectedResponse = { token: 'mock.jwt.token' };
      mockAuthService.login.mockReturnValue(expectedResponse);

      const result = controller.login(undefined);

      expect(result).toEqual(expectedResponse);
      expect(authService.login).toHaveBeenCalledWith(undefined);
    });
  });
});
