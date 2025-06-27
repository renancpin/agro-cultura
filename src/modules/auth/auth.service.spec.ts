import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Roles } from '../user/enums/roles.enum';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;

  const mockUserService = {
    findByUsername: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return access token when credentials are valid', async () => {
      const loginDto: LoginDto = {
        username: 'testuser',
        password: 'password123',
      };

      const mockUser = {
        id: '1',
        username: 'testuser',
        password: 'hashedPassword',
        name: 'Test User',
      };

      const mockToken = 'jwt-token';

      mockUserService.findByUsername.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue(mockToken);

      const result = await service.login(loginDto);

      expect(result).toEqual({ access_token: mockToken });
      expect(mockUserService.findByUsername).toHaveBeenCalledWith(
        loginDto.username,
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        mockUser.password,
      );
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        username: mockUser.username,
        name: mockUser.name,
      });
    });

    it('should return null when user is not found', async () => {
      const loginDto: LoginDto = {
        username: 'testuser',
        password: 'password123',
      };

      mockUserService.findByUsername.mockResolvedValue(null);

      const result = await service.login(loginDto);

      expect(result).toBeNull();
      expect(mockUserService.findByUsername).toHaveBeenCalledWith(
        loginDto.username,
      );
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(mockJwtService.sign).not.toHaveBeenCalled();
    });

    it('should return null when password is invalid', async () => {
      const loginDto: LoginDto = {
        username: 'testuser',
        password: 'wrongpassword',
      };

      const mockUser = {
        id: '1',
        username: 'testuser',
        password: 'hashedPassword',
        name: 'Test User',
      };

      mockUserService.findByUsername.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.login(loginDto);

      expect(result).toBeNull();
      expect(mockUserService.findByUsername).toHaveBeenCalledWith(
        loginDto.username,
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        mockUser.password,
      );
      expect(mockJwtService.sign).not.toHaveBeenCalled();
    });
  });

  describe('register', () => {
    it('should create a new user', async () => {
      const registerDto: RegisterDto = {
        username: 'newuser',
        password: 'password123',
        name: 'New User',
      };

      const mockUser = {
        id: '1',
        ...registerDto,
        password: 'hashedPassword',
        role: Roles.USER,
      };

      mockUserService.create.mockResolvedValue(mockUser);

      const result = await service.register(registerDto);

      expect(result).toEqual(mockUser);
      expect(mockUserService.create).toHaveBeenCalledWith({
        ...registerDto,
        role: Roles.USER,
      });
    });

    it('should throw UnauthorizedException when username already exists', async () => {
      const registerDto: RegisterDto = {
        username: 'existinguser',
        password: 'password123',
        name: 'Existing User',
      };

      mockUserService.create.mockRejectedValue(
        new UnauthorizedException('Nome de usuário já existe'),
      );

      await expect(service.register(registerDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockUserService.create).toHaveBeenCalledWith({
        ...registerDto,
        role: Roles.USER,
      });
    });
  });
});
