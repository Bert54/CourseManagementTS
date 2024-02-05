import {
  ArgumentMetadata,
  BadRequestException,
  ValidationPipe,
} from '@nestjs/common';

import { AddMembershipDto } from './add-membership.dto';
import { ClassMembershipEntity } from '../entities';

describe('AddMembershipDto', () => {
  // ------------------------------------
  // Test suite for format
  // ------------------------------------
  describe('format', () => {
    let expected: AddMembershipDto;

    beforeEach(() => {
      expected = new AddMembershipDto();
      expected.class_name = 'MI6';
    });

    it('should do nothing', () => {
      const dto = new AddMembershipDto();
      dto.class_name = 'MI6';

      dto.format();

      expect(dto).toStrictEqual(expected);
    });

    it('should trim', () => {
      const dto = new AddMembershipDto();
      dto.class_name = '  MI6   ';

      dto.format();

      expect(dto).toStrictEqual(expected);
    });
  });

  // ------------------------------------
  // Test suite for toClassMembershipEntity
  // ------------------------------------
  describe('toClassMembershipEntity', () => {
    it('should work', () => {
      const expected = new ClassMembershipEntity(7, 'MI6');

      const dto = new AddMembershipDto();
      dto.class_name = 'MI6';

      expect(dto.toClassMembershipEntity(7)).toStrictEqual(expected);
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
        metatype: AddMembershipDto,
        data: '',
      };
    });

    it('should be OK', () => {
      const dto = new AddMembershipDto();
      dto.class_name = 'MI6';

      const transformResult: Promise<AddMembershipDto> = validator.transform(
        dto,
        metadata,
      );

      expect(transformResult).resolves.not.toThrow();
    });

    it('should throw due to empty name', () => {
      const dto = new AddMembershipDto();

      const transformResult: Promise<AddMembershipDto> = validator.transform(
        dto,
        metadata,
      );

      expect(transformResult).rejects.toThrow(BadRequestException);
    });

    it('should throw due to name too long', () => {
      const dto = new AddMembershipDto();
      dto.class_name = 'MI666666666666666666666666666666';

      const transformResult: Promise<AddMembershipDto> = validator.transform(
        dto,
        metadata,
      );

      expect(transformResult).rejects.toThrow(BadRequestException);
    });
  });
});
