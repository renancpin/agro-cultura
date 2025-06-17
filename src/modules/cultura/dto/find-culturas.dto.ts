import { PaginationDto } from 'src/shared/validators/pagination.dto';
import { FindManyOptions, ILike } from 'typeorm';
import { Cultura } from '../entities/cultura.entity';
import { IsOptional, isUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class FindCulturasDto extends PaginationDto {
  @IsOptional()
  tipoCultura?: string;

  @IsOptional()
  @Type(() => Number)
  safraAno?: number;

  @IsOptional()
  fazendaId?: string;

  toQuery(): FindManyOptions<Cultura> {
    return {
      ...super.toQuery(),
      where: {
        tipoCultura: this.tipoCultura ? ILike(this.tipoCultura) : undefined,
        safraAno: this.safraAno,
        fazendaId: isUUID(this.fazendaId) ? this.fazendaId : undefined,
      },
    };
  }
}
