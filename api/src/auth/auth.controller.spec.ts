import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller.js';

describe('AuthService', () => {
  let service: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthController],
    }).compile();

    service = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
