import { IsOptional, isUUID } from 'class-validator';
import { PaginationDto } from 'src/shared/validators/pagination.dto';
import { FindManyOptions, ILike } from 'typeorm';
import { Fazenda } from '../entities/fazenda.entity';
import { Transform } from 'class-transformer';
import { validaCpfCnpj } from 'src/shared/validators/cpf-cnpj.validator';

export class FindFazendasDto extends PaginationDto {
  @IsOptional()
  nome?: string;

  @IsOptional()
  cidade?: string;

  @IsOptional()
  estado?: string;

  @IsOptional()
  @Transform(({ value }: { value: string }) => {
    if (isUUID(value)) return value;

    const cpfOuCnpj = validaCpfCnpj(value);
    if (!cpfOuCnpj.isValid) return value;

    return cpfOuCnpj.maskedCpfCnpj;
  })
  produtorId?: string;

  toQuery(): FindManyOptions<Fazenda> {
    return {
      ...super.toQuery(),
      where: {
        nome: this.nome ? ILike(this.nome) : undefined,
        cidade: this.cidade ? ILike(this.cidade) : undefined,
        estado: this.estado ? ILike(this.estado) : undefined,
        produtorId: isUUID(this.produtorId) ? this.produtorId : undefined,
      },
    };
  }
}
