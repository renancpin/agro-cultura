import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UnprocessableEntityException,
  NotFoundException,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ProdutorService } from './produtor.service';
import { CreateProdutorDto } from './dto/create-produtor.dto';
import { UpdateProdutorDto } from './dto/update-produtor.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { FindProdutoresDto } from './dto/find-produtores.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('produtores')
export class ProdutorController {
  constructor(private readonly produtorService: ProdutorService) {}

  @ApiOperation({
    summary: 'Criar um Produtor',
    description: `Valida o CPF/CNPJ informado. Está preparado para o novo formato de CNPJ alfanumérico,
      conforme [Instrução Normativa nº 2.229](https://normasinternet2.receita.fazenda.gov.br/#/consulta/externa/141102),
      de 15/10/2024`,
  })
  @ApiUnprocessableEntityResponse({
    description: 'CPF/CNPJ inválido ou já existe',
  })
  @Post()
  async create(@Body() createProdutorDto: CreateProdutorDto) {
    try {
      const produtor = await this.produtorService.create(createProdutorDto);
      return produtor;
    } catch (error) {
      throw new UnprocessableEntityException(
        error instanceof Error ? error.message : 'Dados Inválidos',
      );
    }
  }

  @ApiOperation({ summary: 'Ver todos os produtores' })
  @Get()
  async findAll(@Query() findProdutoresDto: FindProdutoresDto) {
    const produtores = await this.produtorService.findAll(findProdutoresDto);
    return produtores;
  }

  @ApiOperation({ summary: 'Buscar produtor por uuid ou CPF/CNPJ' })
  @ApiNotFoundResponse({ description: 'Produtor não encontrado' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const produtor = await this.produtorService.findOne(id);
    if (!produtor) throw new NotFoundException('Produtor não encontrado');

    return produtor;
  }

  @ApiOperation({ summary: 'Atualizar produtor' })
  @ApiOkResponse({ description: 'Produtor atualizado com sucesso' })
  @ApiNotFoundResponse({ description: 'Produtor não encontrado' })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProdutorDto: UpdateProdutorDto,
  ) {
    const result = await this.produtorService.update(id, updateProdutorDto);
    if (!result) throw new NotFoundException('Produtor não encontrado');
  }

  @ApiOperation({ summary: 'Remover produtor' })
  @ApiOkResponse({ description: 'Produtor removido com sucesso' })
  @ApiNotFoundResponse({ description: 'Produtor não encontrado' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.produtorService.remove(id);
    if (!result) throw new NotFoundException('Produtor não encontrado');
  }
}
