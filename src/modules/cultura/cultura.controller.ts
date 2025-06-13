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
import { CulturaService } from './cultura.service';
import { CreateCulturaDto } from './dto/create-cultura.dto';
import { UpdateCulturaDto } from './dto/update-cultura.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('culturas')
export class CulturaController {
  constructor(private readonly culturaService: CulturaService) {}

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

  @Get()
  findAll() {
    return this.culturaService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.culturaService.findOne(id);
    if (!result) throw new NotFoundException('Cultura não encontrada');

    return result;
  }

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

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.culturaService.remove(id);
    if (!result) throw new NotFoundException('Cultura não encontrada');
  }
}
