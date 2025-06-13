import { Module } from '@nestjs/common';
import { ProdutorService } from './produtor.service';
import { ProdutorController } from './produtor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Produtor } from './entities/produtor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Produtor])],
  controllers: [ProdutorController],
  providers: [ProdutorService],
  exports: [ProdutorService],
})
export class ProdutorModule {}
