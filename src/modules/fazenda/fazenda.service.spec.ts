import { Test, TestingModule } from '@nestjs/testing';
import { FazendaService } from './fazenda.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Fazenda } from './entities/fazenda.entity';
import { ProdutorService } from '../produtor/produtor.service';
import { CreateFazendaDto } from './dto/create-fazenda.dto';
import { UpdateFazendaDto } from './dto/update-fazenda.dto';

describe('FazendaService', () => {
  let service: FazendaService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockProdutorService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FazendaService,
        {
          provide: getRepositoryToken(Fazenda),
          useValue: mockRepository,
        },
        {
          provide: ProdutorService,
          useValue: mockProdutorService,
        },
      ],
    }).compile();

    service = module.get<FazendaService>(FazendaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new fazenda with valid data', async () => {
      const createDto: CreateFazendaDto = {
        produtorId: '1',
        nome: 'Fazenda Teste',
        cidade: 'São Paulo',
        estado: 'SP',
        areaTotalHectares: 100,
        areaAgricultavelHectares: 60,
        areaVegetacaoHectares: 30,
      };

      const mockProdutor = {
        id: '1',
        nome: 'Produtor Teste',
        cpfOuCnpj: '123.456.789-09',
      };

      const expectedFazenda = {
        id: '1',
        ...createDto,
        produtor: mockProdutor,
      };

      mockProdutorService.findOne.mockResolvedValue(mockProdutor);
      mockRepository.create.mockReturnValue(expectedFazenda);
      mockRepository.save.mockResolvedValue(expectedFazenda);

      const result = await service.create(createDto);

      expect(result).toEqual(expectedFazenda);
      expect(mockProdutorService.findOne).toHaveBeenCalledWith(
        createDto.produtorId,
      );
      expect(mockRepository.create).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw error when areas sum exceeds total area', async () => {
      const createDto: CreateFazendaDto = {
        produtorId: '1',
        nome: 'Fazenda Teste',
        cidade: 'São Paulo',
        estado: 'SP',
        areaTotalHectares: 100,
        areaAgricultavelHectares: 60,
        areaVegetacaoHectares: 50,
      };

      await expect(service.create(createDto)).rejects.toThrow(
        'Soma das áreas não pode ser maior que área total',
      );
    });

    it('should throw error when produtor is not found', async () => {
      const createDto: CreateFazendaDto = {
        produtorId: '1',
        nome: 'Fazenda Teste',
        cidade: 'São Paulo',
        estado: 'SP',
        areaTotalHectares: 100,
        areaAgricultavelHectares: 60,
        areaVegetacaoHectares: 30,
      };

      mockProdutorService.findOne.mockResolvedValue(null);

      await expect(service.create(createDto)).rejects.toThrow(
        'Produtor não encontrado',
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of fazendas with produtor relations', async () => {
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

      mockRepository.find.mockResolvedValue(expectedFazendas);

      const result = await service.findAll();

      expect(result).toEqual(expectedFazendas);
      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: ['produtor'],
      });
    });
  });

  describe('findOne', () => {
    it('should return a fazenda by id with produtor relation', async () => {
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

      mockRepository.findOne.mockResolvedValue(expectedFazenda);

      const result = await service.findOne(id);

      expect(result).toEqual(expectedFazenda);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: ['produtor'],
      });
    });
  });

  describe('update', () => {
    it('should update a fazenda', async () => {
      const id = '1';
      const updateDto: UpdateFazendaDto = {
        nome: 'Fazenda Atualizada',
      };

      mockRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.update(id, updateDto);

      expect(result).toBe(true);
      expect(mockRepository.update).toHaveBeenCalledWith(id, updateDto);
    });

    it('should return false when no fazenda is updated', async () => {
      const id = '1';
      const updateDto: UpdateFazendaDto = {
        nome: 'Fazenda Atualizada',
      };

      mockRepository.update.mockResolvedValue({ affected: 0 });

      const result = await service.update(id, updateDto);

      expect(result).toBe(false);
    });
  });

  describe('remove', () => {
    it('should remove a fazenda', async () => {
      const id = '1';
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(id);

      expect(result).toBe(true);
      expect(mockRepository.delete).toHaveBeenCalledWith(id);
    });

    it('should return false when no fazenda is removed', async () => {
      const id = '1';
      mockRepository.delete.mockResolvedValue({ affected: 0 });

      const result = await service.remove(id);

      expect(result).toBe(false);
    });
  });
});
