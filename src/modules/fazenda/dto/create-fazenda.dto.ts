import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Estados } from 'src/shared/constants/estados.constant';
import {
  SejaNaoVazio,
  SejaPositivo,
} from 'src/shared/validators/validadores.decorator';

export class CreateFazendaDto {
  @ApiProperty({
    title: 'id ou CPF/CNPJ do Produtor',
    example: '12.345.678/0001-95',
    examples: ['12.345.678/0001-95', 'uuid'],
  })
  @SejaNaoVazio()
  produtorId: string;

  @ApiProperty({
    title: 'Nome da propriedade',
    example: 'Fazenda do Sol',
  })
  @SejaNaoVazio()
  nome: string;

  @ApiProperty({ title: 'Cidade da propriedade', example: 'Campinas' })
  @SejaNaoVazio()
  cidade: string;

  @ApiProperty({ title: 'Estado da propriedade', example: 'SC' })
  @IsEnum(Object.keys(Estados))
  @SejaNaoVazio()
  estado: string;

  @ApiProperty({
    title: 'Área total da propriedade',
    description:
      'Deve ser maior ou igual à soma das áreas de vegetação e agricultáveis',
  })
  @SejaPositivo()
  areaTotalHectares: number;

  @SejaPositivo()
  areaVegetacaoHectares: number;

  @SejaPositivo()
  areaAgricultavelHectares: number;
}
