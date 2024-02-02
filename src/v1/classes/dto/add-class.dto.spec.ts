import {
  ArgumentMetadata,
  BadRequestException,
  ValidationPipe,
} from '@nestjs/common';

import { AddClassDto } from './add-class.dto';
import { ClassEntity } from '../entities';

describe('AddClassDto', () => {
  // ------------------------------------
  // Test suite for format
  // ------------------------------------
  describe('format', () => {
    let expected: AddClassDto;

    beforeEach(() => {
      expected = new AddClassDto();
      expected.name = 'MI6';
    });

    it('should do nothing', () => {
      const dto = new AddClassDto();
      dto.name = 'MI6';

      dto.format();

      expect(dto).toStrictEqual(expected);
    });

    it('should trim', () => {
      const dto = new AddClassDto();
      dto.name = '  MI6 ';

      dto.format();

      expect(dto).toStrictEqual(expected);
    });
  });

  // ------------------------------------
  // Test suite for toClassEntity
  // ------------------------------------
  describe('toClassEntity', () => {
    it('should work', () => {
      const expected = new ClassEntity('MI6');

      const dto = new AddClassDto();
      dto.name = 'MI6';

      expect(dto.toClassEntity()).toStrictEqual(expected);
    });
  });

  // ------------------------------------
  // Test suite for Dto Validation
  // ------------------------------------
  describe('Dto validation', () => {
    let validator: ValidationPipe;
    let metadata: ArgumentMetadata;

    beforeEach(() => {
      validator = new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      });
      metadata = {
        type: 'body',
        metatype: AddClassDto,
        data: '',
      };
    });

    it('should be OK', () => {
      const dto = new AddClassDto();
      dto.name = 'MI6';

      const transformResult: Promise<AddClassDto> = validator.transform(
        dto,
        metadata,
      );

      expect(transformResult).resolves.not.toThrow();
    });

    it('should throw due to empty name', () => {
      const dto = new AddClassDto();

      const transformResult: Promise<AddClassDto> = validator.transform(
        dto,
        metadata,
      );

      expect(transformResult).rejects.toThrow(BadRequestException);
    });

    it('should throw due to name too long', () => {
      const dto = new AddClassDto();
      dto.name = 'MI666666666666666666666666666666';

      const transformResult: Promise<AddClassDto> = validator.transform(
        dto,
        metadata,
      );

      expect(transformResult).rejects.toThrow(BadRequestException);
    });
  });
});
