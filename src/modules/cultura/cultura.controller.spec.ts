import { Test, TestingModule } from '@nestjs/testing';
import { CulturaController } from './cultura.controller';
import { CulturaService } from './cultura.service';

describe('CulturaController', () => {
  let controller: CulturaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CulturaController],
      providers: [CulturaService],
    }).compile();

    controller = module.get<CulturaController>(CulturaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
