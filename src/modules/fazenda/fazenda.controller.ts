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
} from '@nestjs/common';
import { FazendaService } from './fazenda.service';
import { CreateFazendaDto } from './dto/create-fazenda.dto';
import { UpdateFazendaDto } from './dto/update-fazenda.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('fazendas')
export class FazendaController {
  constructor(private readonly fazendaService: FazendaService) {}

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

  @Get()
  findAll() {
    return this.fazendaService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const fazenda = await this.fazendaService.findOne(id);
    if (!fazenda) throw new NotFoundException('Fazenda não encontrada');

    return fazenda;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateFazendaDto: UpdateFazendaDto,
  ) {
    const result = await this.fazendaService.update(id, updateFazendaDto);
    if (!result) throw new NotFoundException('Fazenda não encontrada');
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.fazendaService.remove(id);
    if (!result) throw new NotFoundException('Fazenda não encontrada');
  }
}
