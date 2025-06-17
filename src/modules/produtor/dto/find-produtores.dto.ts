import { IsOptional } from 'class-validator';
import { PaginationDto } from 'src/shared/validators/pagination.dto';
import { FindManyOptions, ILike } from 'typeorm';
import { Produtor } from '../entities/produtor.entity';

export class FindProdutoresDto extends PaginationDto {
  @IsOptional()
  nome?: string;

  toQuery(): FindManyOptions<Produtor> {
    return {
      ...super.toQuery(),
      where: {
        nome: this.nome ? ILike(this.nome) : undefined,
      },
    };
  }
}
