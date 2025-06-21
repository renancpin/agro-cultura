import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { NotFoundException } from '@nestjs/common';
import { FindUsersDto } from './dto/find-users.dto';
import { PaginatedUsers } from './dto/paginated-users.dto';

describe('UserController', () => {
  let controller: UserController;

  const mockUserService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findByUsername: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const mockUsers = [
        {
          id: '1',
          username: 'user1',
          name: 'User 1',
          password: 'hashedpwd',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          username: 'user2',
          name: 'User 2',
          password: 'hashedpwd',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      const mockQuery = new FindUsersDto();
      const expected = new PaginatedUsers({
        data: mockUsers,
        page: mockQuery.page,
        results: mockQuery.results,
        totalResults: 2,
      });

      mockUserService.findAll.mockResolvedValue(expected);

      const result = await controller.findAll(mockQuery);

      expect(result).toEqual(expected);
      expect(mockUserService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const mockUser = {
        id: '1',
        username: 'user1',
        name: 'User 1',
      };

      mockUserService.findByUsername.mockResolvedValue(mockUser);

      const result = await controller.findOne('1');

      expect(result).toEqual(mockUser);
      expect(mockUserService.findByUsername).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when user is not found', async () => {
      mockUserService.findByUsername.mockResolvedValue(null);

      await expect(controller.findOne('999')).rejects.toThrow(
        NotFoundException,
      );
      expect(mockUserService.findByUsername).toHaveBeenCalledWith('999');
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const username = 'user1';
      const updateUserDto: UpdateUserDto = {
        name: 'Updated User',
      };

      mockUserService.update.mockResolvedValue(true);

      await expect(
        controller.update(username, updateUserDto),
      ).resolves.not.toThrow();
      expect(mockUserService.update).toHaveBeenCalledWith(
        username,
        updateUserDto,
      );
    });

    it('should throw NotFoundException when user is not found', async () => {
      const username = '999';
      const updateUserDto: UpdateUserDto = {
        name: 'Updated User',
      };

      mockUserService.update.mockResolvedValue(false);

      await expect(controller.update(username, updateUserDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockUserService.update).toHaveBeenCalledWith(
        username,
        updateUserDto,
      );
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const username = 'user1';

      mockUserService.remove.mockResolvedValue(true);

      await expect(controller.remove(username)).resolves.not.toThrow();
      expect(mockUserService.remove).toHaveBeenCalledWith(username);
    });

    it('should throw NotFoundException when user is not found', async () => {
      const username = '999';
      mockUserService.remove.mockResolvedValue(false);

      await expect(controller.remove(username)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockUserService.remove).toHaveBeenCalledWith(username);
    });
  });
});
