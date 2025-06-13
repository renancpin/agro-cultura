import { Module } from '@nestjs/common';
import { CulturaService } from './cultura.service';
import { CulturaController } from './cultura.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cultura } from './entities/cultura.entity';
import { FazendaModule } from '../fazenda/fazenda.module';

@Module({
  imports: [TypeOrmModule.forFeature([Cultura]), FazendaModule],
  controllers: [CulturaController],
  providers: [CulturaService],
})
export class CulturaModule {}
