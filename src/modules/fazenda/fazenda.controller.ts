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
import { FazendaService } from './fazenda.service';
import { CreateFazendaDto } from './dto/create-fazenda.dto';
import { UpdateFazendaDto } from './dto/update-fazenda.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { FindFazendasDto } from './dto/find-fazendas.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('fazendas')
export class FazendaController {
  constructor(private readonly fazendaService: FazendaService) {}

  @ApiOperation({
    summary: 'Criar uma Fazenda',
    description: `Informe o uuid ou CPF/CNPJ do Produtor\n
  Informe o código de duas letras do estado (ex: SC)\n
  A soma das áreas de vegetação e agricultável não pode ultrapassar a área total`,
  })
  @ApiBadRequestResponse({ description: 'Código do estado inválido' })
  @ApiUnprocessableEntityResponse({
    description: 'Produtor inválido ou não encontrado, ou área(s) inválida(s)',
  })
  @Post()
  async create(@Body() createFazendaDto: CreateFazendaDto) {
    try {
      const fazenda = await this.fazendaService.create(createFazendaDto);
      return fazenda;
    } catch (error) {
      throw new UnprocessableEntityException(
        error instanceof Error ? error.message : 'Dados Inválidos',
      );
    }
  }

  @ApiOperation({ summary: 'Ver todas as fazendas' })
  @Get()
  async findAll(@Query() findFazendasDto: FindFazendasDto) {
    return await this.fazendaService.findAll(findFazendasDto);
  }

  @ApiOperation({ summary: 'Buscar fazenda por id' })
  @ApiNotFoundResponse({ description: 'Fazenda não encontrada' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const fazenda = await this.fazendaService.findOne(id);
    if (!fazenda) throw new NotFoundException('Fazenda não encontrada');

    return fazenda;
  }

  @ApiOperation({ summary: 'Atualizar fazenda' })
  @ApiOkResponse({ description: 'Fazenda atualizada com sucesso' })
  @ApiNotFoundResponse({ description: 'Fazenda não encontrada' })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateFazendaDto: UpdateFazendaDto,
  ) {
    const result = await this.fazendaService.update(id, updateFazendaDto);
    if (!result) throw new NotFoundException('Fazenda não encontrada');
  }

  @ApiOperation({ summary: 'Remover fazenda' })
  @ApiOkResponse({ description: 'Fazenda removida com sucesso' })
  @ApiNotFoundResponse({ description: 'Fazenda não encontrada' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.fazendaService.remove(id);
    if (!result) throw new NotFoundException('Fazenda não encontrada');
  }
}
