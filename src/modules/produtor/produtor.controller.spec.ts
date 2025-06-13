import { Test, TestingModule } from '@nestjs/testing';
import { ProdutorController } from './produtor.controller';
import { ProdutorService } from './produtor.service';
import { CreateProdutorDto } from './dto/create-produtor.dto';
import { UpdateProdutorDto } from './dto/update-produtor.dto';
import {
  UnprocessableEntityException,
  NotFoundException,
} from '@nestjs/common';

describe('ProdutorController', () => {
  let controller: ProdutorController;

  const mockProdutorService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProdutorController],
      providers: [
        {
          provide: ProdutorService,
          useValue: mockProdutorService,
        },
      ],
    }).compile();

    controller = module.get<ProdutorController>(ProdutorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new produtor', async () => {
      const createDto: CreateProdutorDto = {
        nome: 'Test Produtor',
        cpfOuCnpj: '123.456.789-09',
      };

      const expectedProdutor = {
        id: '1',
        ...createDto,
      };

      mockProdutorService.create.mockResolvedValue(expectedProdutor);

      const result = await controller.create(createDto);

      expect(result).toEqual(expectedProdutor);
      expect(mockProdutorService.create).toHaveBeenCalledWith(createDto);
    });

    it('should throw UnprocessableEntityException when service throws error', async () => {
      const createDto: CreateProdutorDto = {
        nome: 'Test Produtor',
        cpfOuCnpj: '123.456.789-00',
      };

      mockProdutorService.create.mockRejectedValue(
        new Error('CPF/CNPJ é inválido'),
      );

      await expect(controller.create(createDto)).rejects.toThrow(
        UnprocessableEntityException,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of produtores', async () => {
      const expectedProdutores = [
        { id: '1', nome: 'Produtor 1', cpfOuCnpj: '123.456.789-09' },
        { id: '2', nome: 'Produtor 2', cpfOuCnpj: '987.654.321-09' },
      ];

      mockProdutorService.findAll.mockResolvedValue(expectedProdutores);

      const result = await controller.findAll();

      expect(result).toEqual(expectedProdutores);
      expect(mockProdutorService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a produtor by id', async () => {
      const id = '1';
      const expectedProdutor = {
        id,
        nome: 'Test Produtor',
        cpfOuCnpj: '123.456.789-09',
      };

      mockProdutorService.findOne.mockResolvedValue(expectedProdutor);

      const result = await controller.findOne(id);

      expect(result).toEqual(expectedProdutor);
      expect(mockProdutorService.findOne).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundException when produtor is not found', async () => {
      const id = '1';
      mockProdutorService.findOne.mockResolvedValue(null);

      await expect(controller.findOne(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a produtor', async () => {
      const id = '1';
      const updateDto: UpdateProdutorDto = {
        nome: 'Updated Name',
      };

      mockProdutorService.update.mockResolvedValue(true);

      await controller.update(id, updateDto);

      expect(mockProdutorService.update).toHaveBeenCalledWith(id, updateDto);
    });

    it('should throw NotFoundException when produtor is not found', async () => {
      const id = '1';
      const updateDto: UpdateProdutorDto = {
        nome: 'Updated Name',
      };

      mockProdutorService.update.mockResolvedValue(false);

      await expect(controller.update(id, updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a produtor', async () => {
      const id = '1';
      mockProdutorService.remove.mockResolvedValue(true);

      await controller.remove(id);

      expect(mockProdutorService.remove).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundException when produtor is not found', async () => {
      const id = '1';
      mockProdutorService.remove.mockResolvedValue(false);

      await expect(controller.remove(id)).rejects.toThrow(NotFoundException);
    });
  });
});
