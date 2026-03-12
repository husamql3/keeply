import { Test, TestingModule } from '@nestjs/testing';
import { MagicLinkService } from './magic-link.service';

describe('MagicLinkService', () => {
  let service: MagicLinkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MagicLinkService],
    }).compile();

    service = module.get<MagicLinkService>(MagicLinkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
