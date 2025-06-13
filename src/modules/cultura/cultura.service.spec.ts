import { Test, TestingModule } from '@nestjs/testing';
import { CulturaService } from './cultura.service';

describe('CulturaService', () => {
  let service: CulturaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CulturaService],
    }).compile();

    service = module.get<CulturaService>(CulturaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
