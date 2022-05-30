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

  describe('validate()', () => {
    it('should return true', () => {
      expect(service.validate('+8801840675691')).toBe(true);
    });
    it('should return false', () => {
      expect(service.validate('sadf')).toBe(false);
    });
  });

  describe('format()', () => {
    it('should return +880123456789', () => {
      expect(service.format('+880123456789')).toBe('+880123456789');
    });
  });
});
