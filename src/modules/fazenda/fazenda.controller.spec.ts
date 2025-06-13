import { Test, TestingModule } from '@nestjs/testing';
import { FazendaController } from './fazenda.controller';
import { FazendaService } from './fazenda.service';
import { CreateFazendaDto } from './dto/create-fazenda.dto';
import { UpdateFazendaDto } from './dto/update-fazenda.dto';
import {
  UnprocessableEntityException,
  NotFoundException,
} from '@nestjs/common';

describe('FazendaController', () => {
  let controller: FazendaController;

  const mockFazendaService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FazendaController],
      providers: [
        {
          provide: FazendaService,
          useValue: mockFazendaService,
        },
      ],
    }).compile();

    controller = module.get<FazendaController>(FazendaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new fazenda', async () => {
      const createDto: CreateFazendaDto = {
        produtorId: '1',
        nome: 'Fazenda Teste',
        cidade: 'São Paulo',
        estado: 'SP',
        areaTotalHectares: 100,
        areaAgricultavelHectares: 60,
        areaVegetacaoHectares: 30,
      };

      const expectedFazenda = {
        id: '1',
        ...createDto,
        produtor: {
          id: '1',
          nome: 'Produtor Teste',
          cpfOuCnpj: '123.456.789-09',
        },
      };

      mockFazendaService.create.mockResolvedValue(expectedFazenda);

      const result = await controller.create(createDto);

      expect(result).toEqual(expectedFazenda);
      expect(mockFazendaService.create).toHaveBeenCalledWith(createDto);
    });

    it('should throw UnprocessableEntityException when service throws error', async () => {
      const createDto: CreateFazendaDto = {
        produtorId: '1',
        nome: 'Fazenda Teste',
        cidade: 'São Paulo',
        estado: 'SP',
        areaTotalHectares: 100,
        areaAgricultavelHectares: 60,
        areaVegetacaoHectares: 50,
      };

      mockFazendaService.create.mockRejectedValue(
        new Error('Soma das áreas não pode ser maior que área total'),
      );

      await expect(controller.create(createDto)).rejects.toThrow(
        UnprocessableEntityException,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of fazendas', async () => {
      const expectedFazendas = [
        {
          id: '1',
          nome: 'Fazenda 1',
          cidade: 'São Paulo',
          estado: 'SP',
          areaTotalHectares: 100,
          areaAgricultavelHectares: 60,
          areaVegetacaoHectares: 30,
          produtor: {
            id: '1',
            nome: 'Produtor 1',
            cpfOuCnpj: '123.456.789-09',
          },
        },
      ];

      mockFazendaService.findAll.mockResolvedValue(expectedFazendas);

      const result = await controller.findAll();

      expect(result).toEqual(expectedFazendas);
      expect(mockFazendaService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a fazenda by id', async () => {
      const id = '1';
      const expectedFazenda = {
        id,
        nome: 'Fazenda Teste',
        cidade: 'São Paulo',
        estado: 'SP',
        areaTotalHectares: 100,
        areaAgricultavelHectares: 60,
        areaVegetacaoHectares: 30,
        produtor: {
          id: '1',
          nome: 'Produtor Teste',
          cpfOuCnpj: '123.456.789-09',
        },
      };

      mockFazendaService.findOne.mockResolvedValue(expectedFazenda);

      const result = await controller.findOne(id);

      expect(result).toEqual(expectedFazenda);
      expect(mockFazendaService.findOne).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundException when fazenda is not found', async () => {
      const id = '1';
      mockFazendaService.findOne.mockResolvedValue(null);

      await expect(controller.findOne(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a fazenda', async () => {
      const id = '1';
      const updateDto: UpdateFazendaDto = {
        nome: 'Fazenda Atualizada',
      };

      mockFazendaService.update.mockResolvedValue(true);

      await controller.update(id, updateDto);

      expect(mockFazendaService.update).toHaveBeenCalledWith(id, updateDto);
    });

    it('should throw NotFoundException when fazenda is not found', async () => {
      const id = '1';
      const updateDto: UpdateFazendaDto = {
        nome: 'Fazenda Atualizada',
      };

      mockFazendaService.update.mockResolvedValue(false);

      await expect(controller.update(id, updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a fazenda', async () => {
      const id = '1';
      mockFazendaService.remove.mockResolvedValue(true);

      await controller.remove(id);

      expect(mockFazendaService.remove).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundException when fazenda is not found', async () => {
      const id = '1';
      mockFazendaService.remove.mockResolvedValue(false);

      await expect(controller.remove(id)).rejects.toThrow(NotFoundException);
    });
  });
});
