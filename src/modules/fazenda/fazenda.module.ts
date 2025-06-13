import { Module } from '@nestjs/common';
import { FazendaService } from './fazenda.service';
import { FazendaController } from './fazenda.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fazenda } from './entities/fazenda.entity';
import { ProdutorModule } from '../produtor/produtor.module';

@Module({
  imports: [TypeOrmModule.forFeature([Fazenda]), ProdutorModule],
  controllers: [FazendaController],
  providers: [FazendaService],
  exports: [FazendaService],
})
export class FazendaModule {}
