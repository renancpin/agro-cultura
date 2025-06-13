import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional } from 'class-validator';
import {
  SejaNaoVazio,
  SejaPositivo,
} from 'src/shared/validators/validadores.decorator';

export class CreateCulturaDto {
  @ApiProperty({ title: 'Tipo de Cultura', example: 'Algodão' })
  @SejaNaoVazio()
  tipoCultura: string;

  @SejaPositivo()
  areaHectares: number;

  @ApiProperty({ title: 'Ano da Safra', example: 2023 })
  @IsNumber()
  safraAno: number;

  @IsDate()
  @Type(() => Date)
  dataPlantio: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  dataColheita: Date | null;

  @ApiProperty({ title: 'id da Fazenda onde a cultura está' })
  @SejaNaoVazio()
  fazendaId: string;
}
