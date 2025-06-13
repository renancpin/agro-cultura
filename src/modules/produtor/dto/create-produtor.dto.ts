import { ApiProperty } from '@nestjs/swagger';
import { SejaNaoVazio } from 'src/shared/validators/validadores.decorator';

export class CreateProdutorDto {
  @ApiProperty({ title: 'Nome do produtor', example: 'Francisco José' })
  @SejaNaoVazio()
  nome: string;

  @ApiProperty({ title: 'CPF ou CNPJ', example: '12.345.678/0001-95' })
  @SejaNaoVazio()
  cpfOuCnpj: string;
}
