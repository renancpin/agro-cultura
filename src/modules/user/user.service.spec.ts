import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UserService', () => {
  let service: UserService;

  const mockRepository = {
    exists: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user with valid data', async () => {
      const createDto: CreateUserDto = {
        name: 'Usuario Teste',
        username: 'usuario123',
        password: 'password123',
      };

      const expectedUser = {
        id: '1',
        nome: 'Usuario Teste',
        username: 'usuario123',
      };

      mockRepository.exists.mockResolvedValue(false);
      mockRepository.create.mockReturnValue(expectedUser);
      mockRepository.save.mockResolvedValue(expectedUser);

      const result = await service.create(createDto);

      expect(result).toEqual(expectedUser);
      expect(mockRepository.exists).toHaveBeenCalled();
      expect(mockRepository.create).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw error when user already exists', async () => {
      const createDto: CreateUserDto = {
        name: 'Usuario Teste',
        username: 'usuario123',
        password: 'password123',
      };

      mockRepository.exists.mockResolvedValue(true);

      await expect(service.create(createDto)).rejects.toThrow(
        'Nome de usuário já existe',
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const expectedUsers = [
        {
          id: '1',
          name: 'Usuario Teste',
          username: 'usuario123',
        },
        {
          id: '2',
          name: 'Usuario Teste2',
          username: 'usuario234',
        },
      ];

      mockRepository.find.mockResolvedValue(expectedUsers);

      const result = await service.findAll();

      expect(result).toEqual(expectedUsers);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by username', async () => {
      const username = 'usuario123';
      const expectedUser = {
        id: '1',
        username,
        name: 'Usuario Teste',
        password: 'hashedPassword',
      };

      mockRepository.findOne.mockResolvedValue(expectedUser);

      const result = await service.findByUsername(username);

      expect(result).toEqual(expectedUser);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { username: username },
        select: ['id', 'username', 'password', 'name'],
      });
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const username = 'usuario123';
      const updateDto: UpdateUserDto = {
        name: 'Usuario Teste2',
      };

      const existingUser = {
        id: '1',
        nome: 'Usuario Teste2',
        username,
      };

      mockRepository.findOne.mockResolvedValue(existingUser);
      mockRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.update(username, updateDto);

      expect(result).toBe(true);
      expect(mockRepository.update).toHaveBeenCalledWith(
        { username: username },
        updateDto,
      );
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const username = 'usuario123';
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(username);

      expect(result).toBe(true);
      expect(mockRepository.delete).toHaveBeenCalledWith(username);
    });

    it('should return false when no cultura is removed', async () => {
      const username = 'usuario123';
      mockRepository.delete.mockResolvedValue({ affected: 0 });

      const result = await service.remove(username);

      expect(result).toBe(false);
      expect(mockRepository.delete).toHaveBeenCalledWith(username);
    });
  });
});
