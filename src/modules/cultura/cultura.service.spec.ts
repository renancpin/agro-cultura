import { Test, TestingModule } from '@nestjs/testing';
import { CulturaService } from './cultura.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Cultura } from './entities/cultura.entity';
import { FazendaService } from '../fazenda/fazenda.service';
import { CreateCulturaDto } from './dto/create-cultura.dto';
import { UpdateCulturaDto } from './dto/update-cultura.dto';
import { FindCulturasDto } from './dto/find-culturas.dto';
import { PaginatedCulturas } from './dto/paginated-culturas.dto';

describe('CulturaService', () => {
  let service: CulturaService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findAndCount: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getRawOne: jest.fn(() => ({ sum: 0 })),
    })),
  };

  const mockFazendaService = {
    findOne: jest.fn(),
  };

  const mockFazenda = {
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
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    produtorId: '1',
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CulturaService,
        {
          provide: getRepositoryToken(Cultura),
          useValue: mockRepository,
        },
        {
          provide: FazendaService,
          useValue: mockFazendaService,
        },
      ],
    }).compile();

    service = module.get<CulturaService>(CulturaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new cultura with valid data', async () => {
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
        fazenda: mockFazenda,
      };

      mockFazendaService.findOne.mockResolvedValue(mockFazenda);
      mockRepository.create.mockReturnValue(expectedCultura);
      mockRepository.save.mockResolvedValue(expectedCultura);

      const result = await service.create(createDto);

      expect(result).toEqual(expectedCultura);
      expect(mockFazendaService.findOne).toHaveBeenCalledWith(
        createDto.fazendaId,
      );
      expect(mockRepository.create).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw error when fazenda is not found', async () => {
      const createDto: CreateCulturaDto = {
        tipoCultura: 'Soja',
        dataColheita: new Date('2024-03-01'),
        dataPlantio: new Date('2023-10-01'),
        safraAno: 2024,
        areaHectares: 50,
        fazendaId: '1',
      };

      mockFazendaService.findOne.mockResolvedValue(null);

      await expect(service.create(createDto)).rejects.toThrow(
        'Fazenda não encontrada',
      );
    });

    it('should throw error when area exceeds available area', async () => {
      const createDto: CreateCulturaDto = {
        tipoCultura: 'Soja',
        dataColheita: new Date('2024-03-01'),
        dataPlantio: new Date('2023-10-01'),
        safraAno: 2024,
        areaHectares: 50,
        fazendaId: '1',
      };

      mockFazendaService.findOne.mockResolvedValue({
        ...mockFazenda,
        areaAgricultavelHectares: 40,
      });

      await expect(service.create(createDto)).rejects.toThrow(
        'Área agricultável da fazenda não disponível',
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
          fazenda: mockFazenda,
          fazendaId: '1',
        },
      ];
      const mockQuery = new FindCulturasDto();
      const expected = new PaginatedCulturas({
        data: expectedCulturas,
        page: mockQuery.page,
        results: mockQuery.results,
        totalResults: 1,
      });

      mockRepository.findAndCount.mockResolvedValue([expectedCulturas, 1]);

      const result = await service.findAll(mockQuery);

      expect(result).toEqual(expected);
      expect(mockRepository.findAndCount).toHaveBeenCalled();
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

      mockRepository.findOne.mockResolvedValue(expectedCultura);

      const result = await service.findOne(id);

      expect(result).toEqual(expectedCultura);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: ['fazenda'],
      });
    });
  });

  describe('update', () => {
    it('should update a cultura', async () => {
      const id = '1';
      const updateDto: UpdateCulturaDto = {
        tipoCultura: 'Milho',
        areaHectares: 40,
      };

      const existingCultura = {
        id,
        tipoCultura: 'Soja',
        safraAno: 2024,
        areaHectares: 50,
        fazenda: {
          id: '1',
          areaAgricultavelHectares: 100,
        },
      };

      mockRepository.findOne.mockResolvedValue(existingCultura);
      mockRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.update(id, updateDto);

      expect(result).toBe(true);
      expect(mockRepository.update).toHaveBeenCalledWith(id, updateDto);
    });

    it('should throw error when area exceeds available area', async () => {
      const id = '1';
      const updateDto: UpdateCulturaDto = {
        tipoCultura: 'Milho',
        areaHectares: 60,
      };

      const existingCultura = {
        id,
        tipoCultura: 'Soja',
        safraAno: 2024,
        areaHectares: 50,
        fazenda: { ...mockFazenda, areaAgricultavelHectares: 50 },
      };

      mockRepository.findOne.mockResolvedValue(existingCultura);
      mockRepository.createQueryBuilder.mockImplementationOnce(() => {
        const mock = mockRepository.createQueryBuilder();
        mock.getRawOne.mockReturnValue({ sum: existingCultura.areaHectares });
        return mock;
      });

      await expect(service.update(id, updateDto)).rejects.toThrow(
        'Área agricultável da fazenda não disponível',
      );
    });

    it('should return false when cultura is not found', async () => {
      const id = '1';
      const updateDto: UpdateCulturaDto = {
        tipoCultura: 'Milho',
        areaHectares: 30,
      };

      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.update(id, updateDto);

      expect(result).toBe(false);
    });
  });

  describe('remove', () => {
    it('should remove a cultura', async () => {
      const id = '1';
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(id);

      expect(result).toBe(true);
      expect(mockRepository.delete).toHaveBeenCalledWith(id);
    });

    it('should return false when no cultura is removed', async () => {
      const id = '1';
      mockRepository.delete.mockResolvedValue({ affected: 0 });

      const result = await service.remove(id);

      expect(result).toBe(false);
    });
  });
});
