import { Injectable } from '@nestjs/common';
import { CreateCulturaDto } from './dto/create-cultura.dto';
import { UpdateCulturaDto } from './dto/update-cultura.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cultura } from './entities/cultura.entity';
import { Repository } from 'typeorm';
import { FazendaService } from '../fazenda/fazenda.service';
import { FindCulturasDto } from './dto/find-culturas.dto';
import { PaginatedCulturas } from './dto/paginated-culturas.dto';

@Injectable()
export class CulturaService {
  constructor(
    @InjectRepository(Cultura) private culturaRepository: Repository<Cultura>,
    private fazendaService: FazendaService,
  ) {}

  private async getSomaAreaPlantada(params: {
    fazendaId: string;
    safraAno: number;
  }): Promise<number> {
    const { fazendaId, safraAno } = params;
    const result = await this.culturaRepository
      .createQueryBuilder('cultura')
      .select(`sum(cultura.areaHectares)`, 'sum')
      .where(
        `cultura.safraAno = :safraAno AND cultura.fazendaId = :fazendaId`,
        { safraAno, fazendaId },
      )
      .getRawOne<{ sum: number }>();

    return Number(result?.sum ?? 0);
  }

  async create(createCulturaDto: CreateCulturaDto): Promise<Cultura> {
    const {
      tipoCultura,
      dataColheita,
      dataPlantio,
      safraAno,
      areaHectares,
      fazendaId,
    } = createCulturaDto;
    const fazenda = await this.fazendaService.findOne(fazendaId);
    if (!fazenda) throw new Error('Fazenda não encontrada');

    const areaPlantada = await this.getSomaAreaPlantada({
      fazendaId,
      safraAno,
    });
    if (areaPlantada + areaHectares > fazenda.areaAgricultavelHectares) {
      throw new Error('Área agricultável da fazenda não disponível');
    }

    const cultura = this.culturaRepository.create({
      tipoCultura,
      safraAno,
      dataPlantio,
      dataColheita,
      areaHectares,
      fazenda,
    });
    await this.culturaRepository.save(cultura);

    return cultura;
  }

  async findAll(props: FindCulturasDto): Promise<PaginatedCulturas> {
    const query = props.toQuery();
    const [culturas, total] = await this.culturaRepository.findAndCount({
      ...query,
      relations: ['fazenda'],
      select: { fazenda: { id: true, nome: true } },
    });

    const culturasResult = new PaginatedCulturas({
      data: culturas,
      page: props.page,
      results: props.results,
      totalResults: total,
    });

    return culturasResult;
  }

  async findOne(id: string) {
    const cultura = await this.culturaRepository.findOne({
      where: { id },
      relations: ['fazenda'],
    });
    return cultura;
  }

  async update(
    id: string,
    updateCulturaDto: UpdateCulturaDto,
  ): Promise<boolean> {
    const { areaHectares, dataColheita, dataPlantio, safraAno, tipoCultura } =
      updateCulturaDto;

    if (areaHectares) {
      const cultura = await this.findOne(id);
      if (!cultura) return false;

      const areaAntiga = cultura.areaHectares;
      const areaPlantada = await this.getSomaAreaPlantada({
        fazendaId: cultura.fazendaId,
        safraAno: safraAno ?? cultura.safraAno,
      });
      if (
        areaPlantada - areaAntiga + areaHectares >
        cultura.fazenda.areaAgricultavelHectares
      ) {
        throw new Error('Área agricultável da fazenda não disponível');
      }
    }

    const result = await this.culturaRepository.update(id, {
      areaHectares,
      dataColheita,
      dataPlantio,
      safraAno,
      tipoCultura,
    });
    if (!result.affected) return false;

    return true;
  }

  async remove(id: string) {
    const result = await this.culturaRepository.delete(id);
    if (!result.affected) return false;

    return true;
  }
}
