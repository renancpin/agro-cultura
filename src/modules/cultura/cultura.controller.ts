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
import { CulturaService } from './cultura.service';
import { CreateCulturaDto } from './dto/create-cultura.dto';
import { UpdateCulturaDto } from './dto/update-cultura.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { FindCulturasDto } from './dto/find-culturas.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('culturas')
export class CulturaController {
  constructor(private readonly culturaService: CulturaService) {}

  @ApiOperation({
    summary: 'Criar cultura',
    description: `
Informe o tipo de cultura, a área cultivada e o ano da safra.

A soma das áreas das culturas de uma mesma fazenda e safra deve ser menor ou igual à área agricultável da fazenda`,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Fazenda não encontrada ou sem área agricultável disponível',
  })
  @Post()
  async create(@Body() createCulturaDto: CreateCulturaDto) {
    try {
      const cultura = await this.culturaService.create(createCulturaDto);
      return cultura;
    } catch (error) {
      throw new UnprocessableEntityException(
        error instanceof Error ? error.message : 'Dados Inválidos',
      );
    }
  }

  @ApiOperation({ summary: 'Ver todas as culturas' })
  @Get()
  async findAll(@Query() findCulturasDto: FindCulturasDto) {
    const culturas = await this.culturaService.findAll(findCulturasDto);
    return culturas;
  }

  @ApiOperation({ summary: 'Buscar cultura por id' })
  @ApiNotFoundResponse({ description: 'Cultura não encontrada' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.culturaService.findOne(id);
    if (!result) throw new NotFoundException('Cultura não encontrada');

    return result;
  }

  @ApiOperation({ summary: 'Atualizar cultura' })
  @ApiOkResponse({ description: 'Cultura atualizada com sucesso' })
  @ApiNotFoundResponse({ description: 'Cultura não encontrada' })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCulturaDto: UpdateCulturaDto,
  ) {
    let result = false;
    try {
      result = await this.culturaService.update(id, updateCulturaDto);
    } catch (error) {
      throw new UnprocessableEntityException(
        error instanceof Error ? error.message : 'Dados Inválidos',
      );
    }

    if (!result) throw new NotFoundException('Cultura não encontrada');
  }

  @ApiOperation({ summary: 'Remover cultura' })
  @ApiOkResponse({ description: 'Cultura removida com sucesso' })
  @ApiNotFoundResponse({ description: 'Cultura não encontrada' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.culturaService.remove(id);
    if (!result) throw new NotFoundException('Cultura não encontrada');
  }
}
