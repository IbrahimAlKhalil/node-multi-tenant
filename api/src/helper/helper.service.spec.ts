import { LibPnService } from './../lib-pn/lib-pn.service';
import { Test, TestingModule } from '@nestjs/testing';
import { HelperService } from './helper.service.js';

describe('HelperService', () => {
  let service: HelperService;

  const libPnService = {
    validate: jest.fn(),
    format: jest.fn(),
  };

  //todo add LibPnService to solve the error

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: LibPnService,
          useValue: libPnService,
        },
        HelperService,
      ],
    }).compile();

    service = module.get<HelperService>(HelperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  /**
   * isEmail Testing
   */

  describe('isEmail()', () => {
    // Joi mock
    jest.mock('joi', () => {
      return {
        validate: jest.fn(),
      };
    });

    it('should return true', () => {
      expect(service.isEmail('test@test.com')).toBe(true);
    });

    it('should return false', () => {
      expect(service.isEmail('testgmail.com')).toBe(false);
    });
  });

  /**
   * getIdentityType Testing
   */
  describe('getIdentityType', () => {
    it('should return email identity', () => {
      const value = 'test@test.com';
      expect(service.getIdentityType(value)).toEqual({
        type: 'email',
        value,
      });
    });

    it('should return mobile identity', () => {
      // jest.spyOn(libPnService, 'validate').mockReturnValueOnce(true);
      jest.spyOn(libPnService, 'format').mockReturnValue('+880123456789');
      const value = '+880123456789';
      libPnService.validate
        .mockReturnValueOnce(value)
        .mockReturnValueOnce(true),
        expect(service.getIdentityType(value)).toEqual({
          type: 'mobile',
          value,
        });
    });

    it('should return username identity', () => {
      const value = 'usernameTest';
      libPnService.validate
        .mockReturnValueOnce(value)
        .mockReturnValueOnce(false),
        expect(service.getIdentityType(value)).toEqual({
          type: 'username',
          value,
        });
    });
  });

  /**
   * generateRandomString Testing
   */
  describe('generateRandomString', () => {
    it('should return 32 characters string', async () => {
      const length = 32;
      expect(await service.generateRandomString(length)).toHaveLength(
        length * 2,
      );
    });
  });

  /**
   * generateRandomNumber Testing
   */
  describe('generateRandomNumber', () => {
    it('should return 3 digits number', async () => {
      const length = 1;
      const number = await service.generateRandomNumber(length);
      expect(number.toString()).toHaveLength(length);
    });
    // case of length 0
    it('should return error', async () => {
      const length = 0;
      expect(service.generateRandomNumber(length)).rejects.toThrow(
        'length must be greater than 0',
      );
    });
  });
});
