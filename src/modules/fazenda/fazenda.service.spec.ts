import { Test, TestingModule } from '@nestjs/testing';
import { FazendaService } from './fazenda.service';

describe('FazendaService', () => {
  let service: FazendaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FazendaService],
    }).compile();

    service = module.get<FazendaService>(FazendaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
