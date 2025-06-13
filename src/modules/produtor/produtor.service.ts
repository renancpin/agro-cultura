import { Injectable } from '@nestjs/common';
import { CreateProdutorDto } from './dto/create-produtor.dto';
import { UpdateProdutorDto } from './dto/update-produtor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Produtor } from './entities/produtor.entity';
import { Repository } from 'typeorm';
import { validaCpfCnpj } from 'src/shared/validators/cpf-cnpj.validator';
import { isUUID } from 'class-validator';

@Injectable()
export class ProdutorService {
  constructor(
    @InjectRepository(Produtor)
    private produtorRepository: Repository<Produtor>,
  ) {}

  async create(createProdutorDto: CreateProdutorDto): Promise<Produtor> {
    const cpfOuCnpj = validaCpfCnpj(createProdutorDto.cpfOuCnpj);
    if (!cpfOuCnpj.isValid) throw new Error('CPF/CNPJ é inválido');

    const produtorAlreadyExists = await this.produtorRepository.exists({
      where: { cpfOuCnpj: cpfOuCnpj.maskedCpfCnpj },
    });
    if (produtorAlreadyExists) throw new Error('CPF/CNPJ já existe');

    const produtor = this.produtorRepository.create({
      nome: createProdutorDto.nome,
      cpfOuCnpj: cpfOuCnpj.maskedCpfCnpj,
    });

    await this.produtorRepository.save(produtor);

    return produtor;
  }

  async findAll() {
    return await this.produtorRepository.find();
  }

  async findOne(id: string): Promise<Produtor | null> {
    const isId = isUUID(id);
    const whereClause = isId ? { id: id } : { cpfOuCnpj: id };

    const produtor = await this.produtorRepository.findOne({
      where: whereClause,
    });
    return produtor;
  }

  async update(
    id: string,
    updateProdutorDto: UpdateProdutorDto,
  ): Promise<boolean> {
    const { nome } = updateProdutorDto;
    if (!nome) return false;

    const result = await this.produtorRepository.update(id, { nome });
    if (!result.affected) return false;

    return true;
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.produtorRepository.delete(id);
    if (!result.affected) return false;

    return true;
  }
}
