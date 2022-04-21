import { Test, TestingModule } from '@nestjs/testing';
import { LibPnService } from './lib-pn.service.js';

describe('LibPnService', () => {
  let service: LibPnService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LibPnService],
    }).compile();

    service = module.get<LibPnService>(LibPnService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
