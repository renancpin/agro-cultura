import { Test, TestingModule } from '@nestjs/testing';
import { CulturaController } from './cultura.controller';
import { CulturaService } from './cultura.service';
import { CreateCulturaDto } from './dto/create-cultura.dto';
import { UpdateCulturaDto } from './dto/update-cultura.dto';
import {
  UnprocessableEntityException,
  NotFoundException,
} from '@nestjs/common';

describe('CulturaController', () => {
  let controller: CulturaController;

  const mockCulturaService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CulturaController],
      providers: [
        {
          provide: CulturaService,
          useValue: mockCulturaService,
        },
      ],
    }).compile();

    controller = module.get<CulturaController>(CulturaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new cultura', async () => {
      const createDto: CreateCulturaDto = {
        tipoCultura: 'Soja',
        dataColheita: new Date('2024-03-01'),
        dataPlantio: new Date('2023-10-01'),
        safraAno: 2024,
        areaHectares: 50,
        fazendaId: '1',
      };

      const expectedCultura = {
        id: '1',
        ...createDto,
        fazenda: {
          id: '1',
          nome: 'Fazenda Teste',
        },
      };

      mockCulturaService.create.mockResolvedValue(expectedCultura);

      const result = await controller.create(createDto);

      expect(result).toEqual(expectedCultura);
      expect(mockCulturaService.create).toHaveBeenCalledWith(createDto);
    });

    it('should throw UnprocessableEntityException when service throws error', async () => {
      const createDto: CreateCulturaDto = {
        tipoCultura: 'Soja',
        dataColheita: new Date('2024-03-01'),
        dataPlantio: new Date('2023-10-01'),
        safraAno: 2024,
        areaHectares: 50,
        fazendaId: '1',
      };

      mockCulturaService.create.mockRejectedValue(
        new Error('Área agricultável da fazenda não disponível'),
      );

      await expect(controller.create(createDto)).rejects.toThrow(
        UnprocessableEntityException,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of culturas', async () => {
      const expectedCulturas = [
        {
          id: '1',
          tipoCultura: 'Soja',
          dataColheita: new Date('2024-03-01'),
          dataPlantio: new Date('2023-10-01'),
          safraAno: 2024,
          areaHectares: 50,
          fazenda: {
            id: '1',
            nome: 'Fazenda Teste',
          },
        },
      ];

      mockCulturaService.findAll.mockResolvedValue(expectedCulturas);

      const result = await controller.findAll();

      expect(result).toEqual(expectedCulturas);
      expect(mockCulturaService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a cultura by id', async () => {
      const id = '1';
      const expectedCultura = {
        id,
        tipoCultura: 'Soja',
        dataColheita: new Date('2024-03-01'),
        dataPlantio: new Date('2023-10-01'),
        safraAno: 2024,
        areaHectares: 50,
        fazenda: {
          id: '1',
          nome: 'Fazenda Teste',
        },
      };

      mockCulturaService.findOne.mockResolvedValue(expectedCultura);

      const result = await controller.findOne(id);

      expect(result).toEqual(expectedCultura);
      expect(mockCulturaService.findOne).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundException when cultura is not found', async () => {
      const id = '1';
      mockCulturaService.findOne.mockResolvedValue(null);

      await expect(controller.findOne(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a cultura', async () => {
      const id = '1';
      const updateDto: UpdateCulturaDto = {
        tipoCultura: 'Milho',
        areaHectares: 40,
      };

      mockCulturaService.update.mockResolvedValue(true);

      await controller.update(id, updateDto);

      expect(mockCulturaService.update).toHaveBeenCalledWith(id, updateDto);
    });

    it('should throw NotFoundException when cultura is not found', async () => {
      const id = '1';
      const updateDto: UpdateCulturaDto = {
        tipoCultura: 'Milho',
      };

      mockCulturaService.update.mockResolvedValue(false);

      await expect(controller.update(id, updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw UnprocessableEntityException when area exceeds available area', async () => {
      const id = '1';
      const updateDto: UpdateCulturaDto = {
        tipoCultura: 'Milho',
        areaHectares: 60,
      };

      mockCulturaService.update.mockRejectedValue(
        new Error('Área agricultável da fazenda não disponível'),
      );

      await expect(controller.update(id, updateDto)).rejects.toThrow(
        UnprocessableEntityException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a cultura', async () => {
      const id = '1';
      mockCulturaService.remove.mockResolvedValue(true);

      await controller.remove(id);

      expect(mockCulturaService.remove).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundException when cultura is not found', async () => {
      const id = '1';
      mockCulturaService.remove.mockResolvedValue(false);

      await expect(controller.remove(id)).rejects.toThrow(NotFoundException);
    });
  });
});
