import { Test, TestingModule } from '@nestjs/testing';
import { FazendaController } from './fazenda.controller';
import { FazendaService } from './fazenda.service';

describe('FazendaController', () => {
  let controller: FazendaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FazendaController],
      providers: [FazendaService],
    }).compile();

    controller = module.get<FazendaController>(FazendaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
