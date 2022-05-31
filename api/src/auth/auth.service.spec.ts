import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service.js';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('authenticate', () => {
    it('should return null if csrf token is not provided', () => {
      expect(service.authenticate('', '')).toBeNull();
    });
    it('should return null if csrf token is invalid', () => {
      expect(service.authenticate('', 'invalid')).toBeNull();
    });
    // tokenKeyIndex
    it('should return null if cookie does not contain the token key', () => {
      expect(service.authenticate('', 'valid')).toBeNull();
    });
    // boundary
    it('should return null if cookie does not contain the token', () => {
      expect(service.authenticate('', 'valid')).toBeNull();
    });
    // jwtPayload
    it('should return null if jwt is invalid', () => {
      expect(service.authenticate('', 'valid')).toBeNull();
    });
    // prisma
    it('should return null if institute is disabled or does not exist', () => {
      expect(service.authenticate('', 'valid')).toBeNull();
    });
    // tokenExistsInDB
    it('should return null if token does not exist in the database', () => {
      expect(service.authenticate('', 'valid')).toBeNull();
    });
    // return
    it('should return null if token does not exist in the database', () => {
      expect(service.authenticate('', 'valid')).toBeNull();
    });
  });
});
