import { Test, TestingModule } from '@nestjs/testing';
import { ProdutorService } from './produtor.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Produtor } from './entities/produtor.entity';
import { CreateProdutorDto } from './dto/create-produtor.dto';
import { UpdateProdutorDto } from './dto/update-produtor.dto';
import { FindProdutoresDto } from './dto/find-produtores.dto';
import { PaginatedProdutores } from './dto/paginated-produtores.dto';

describe('ProdutorService', () => {
  let service: ProdutorService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findAndCount: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    exists: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProdutorService,
        {
          provide: getRepositoryToken(Produtor),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProdutorService>(ProdutorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new produtor with valid CPF', async () => {
      const createDto: CreateProdutorDto = {
        nome: 'Test Produtor',
        cpfOuCnpj: '123.456.789-09',
      };

      const expectedProdutor = {
        id: '1',
        nome: createDto.nome,
        cpfOuCnpj: createDto.cpfOuCnpj,
      };

      mockRepository.exists.mockResolvedValue(false);
      mockRepository.create.mockReturnValue(expectedProdutor);
      mockRepository.save.mockResolvedValue(expectedProdutor);

      const result = await service.create(createDto);

      expect(result).toEqual(expectedProdutor);
      expect(mockRepository.exists).toHaveBeenCalled();
      expect(mockRepository.create).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw error for invalid CPF', async () => {
      const createDto: CreateProdutorDto = {
        nome: 'Test Produtor',
        cpfOuCnpj: '123.456.789-00',
      };

      await expect(service.create(createDto)).rejects.toThrow(
        'CPF/CNPJ é inválido',
      );
    });

    it('should throw error for existing CPF/CNPJ', async () => {
      const createDto: CreateProdutorDto = {
        nome: 'Test Produtor',
        cpfOuCnpj: '123.456.789-09',
      };

      mockRepository.exists.mockResolvedValue(true);

      await expect(service.create(createDto)).rejects.toThrow(
        'CPF/CNPJ já existe',
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of produtores', async () => {
      const expectedProdutores = [
        {
          id: '1',
          nome: 'Produtor 1',
          cpfOuCnpj: '123.456.789-09',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          nome: 'Produtor 2',
          cpfOuCnpj: '987.654.321-09',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      const mockQuery = new FindProdutoresDto();
      const expected = new PaginatedProdutores({
        data: expectedProdutores,
        page: mockQuery.page,
        results: mockQuery.results,
        totalResults: 2,
      });

      mockRepository.findAndCount.mockResolvedValue([expectedProdutores, 2]);

      const result = await service.findAll(mockQuery);

      expect(result).toEqual(expected);
      expect(mockRepository.findAndCount).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should find produtor by UUID', async () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      const expectedProdutor = {
        id: uuid,
        nome: 'Test Produtor',
        cpfOuCnpj: '123.456.789-09',
      };

      mockRepository.findOne.mockResolvedValue(expectedProdutor);

      const result = await service.findOne(uuid);

      expect(result).toEqual(expectedProdutor);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: uuid },
      });
    });

    it('should find produtor by CPF/CNPJ', async () => {
      const cpf = '123.456.789-09';
      const expectedProdutor = {
        id: '1',
        nome: 'Test Produtor',
        cpfOuCnpj: cpf,
      };

      mockRepository.findOne.mockResolvedValue(expectedProdutor);

      const result = await service.findOne(cpf);

      expect(result).toEqual(expectedProdutor);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { cpfOuCnpj: cpf },
      });
    });
  });

  describe('update', () => {
    it('should update produtor name', async () => {
      const id = '1';
      const updateDto: UpdateProdutorDto = {
        nome: 'Updated Name',
      };

      mockRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.update(id, updateDto);

      expect(result).toBe(true);
      expect(mockRepository.update).toHaveBeenCalledWith(id, {
        nome: updateDto.nome,
      });
    });

    it('should return false when no produtor is updated', async () => {
      const id = '1';
      const updateDto: UpdateProdutorDto = {
        nome: 'Updated Name',
      };

      mockRepository.update.mockResolvedValue({ affected: 0 });

      const result = await service.update(id, updateDto);

      expect(result).toBe(false);
    });
  });

  describe('remove', () => {
    it('should remove produtor', async () => {
      const id = '1';
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(id);

      expect(result).toBe(true);
      expect(mockRepository.delete).toHaveBeenCalledWith(id);
    });

    it('should return false when no produtor is removed', async () => {
      const id = '1';
      mockRepository.delete.mockResolvedValue({ affected: 0 });

      const result = await service.remove(id);

      expect(result).toBe(false);
    });
  });
});
