import { Injectable } from '@nestjs/common';
import { CreateFazendaDto } from './dto/create-fazenda.dto';
import { UpdateFazendaDto } from './dto/update-fazenda.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Fazenda } from './entities/fazenda.entity';
import { Repository } from 'typeorm';
import { ProdutorService } from '../produtor/produtor.service';

@Injectable()
export class FazendaService {
  constructor(
    @InjectRepository(Fazenda) private fazendaRepository: Repository<Fazenda>,
    private produtorService: ProdutorService,
  ) {}

  async create(createFazendaDto: CreateFazendaDto): Promise<Fazenda> {
    const {
      produtorId,
      areaTotalHectares,
      areaAgricultavelHectares,
      areaVegetacaoHectares,
      cidade,
      estado,
      nome,
    } = createFazendaDto;

    if (areaVegetacaoHectares + areaAgricultavelHectares > areaTotalHectares) {
      throw new Error('Soma das áreas não pode ser maior que área total');
    }

    const produtor = await this.produtorService.findOne(produtorId);
    if (!produtor) throw new Error('Produtor não encontrado');

    const fazenda = this.fazendaRepository.create({
      cidade,
      estado,
      nome,
      areaTotalHectares,
      areaAgricultavelHectares,
      areaVegetacaoHectares,
      produtor,
    });
    await this.fazendaRepository.save(fazenda);

    return fazenda;
  }

  async findAll() {
    return await this.fazendaRepository.find({ relations: ['produtor'] });
  }

  async findOne(id: string): Promise<Fazenda | null> {
    const fazenda = await this.fazendaRepository.findOne({
      where: { id },
      relations: ['produtor'],
    });

    return fazenda;
  }

  async update(
    id: string,
    updateFazendaDto: UpdateFazendaDto,
  ): Promise<boolean> {
    const result = await this.fazendaRepository.update(id, updateFazendaDto);
    if (!result.affected) return false;

    return true;
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.fazendaRepository.delete(id);
    if (!result.affected) return false;

    return true;
  }
}
