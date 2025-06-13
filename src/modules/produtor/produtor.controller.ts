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
import { ProdutorService } from './produtor.service';
import { CreateProdutorDto } from './dto/create-produtor.dto';
import { UpdateProdutorDto } from './dto/update-produtor.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('produtores')
export class ProdutorController {
  constructor(private readonly produtorService: ProdutorService) {}

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

  @Get()
  findAll() {
    return this.produtorService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const produtor = await this.produtorService.findOne(id);
    if (!produtor) throw new NotFoundException('Produtor não encontrado');

    return produtor;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProdutorDto: UpdateProdutorDto,
  ) {
    const result = await this.produtorService.update(id, updateProdutorDto);
    if (!result) throw new NotFoundException('Produtor não encontrado');
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.produtorService.remove(id);
    if (!result) throw new NotFoundException('Produtor não encontrado');
  }
}
