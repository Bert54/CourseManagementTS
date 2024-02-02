import { createMock } from '@golevelup/ts-jest';
import {
  ArgumentMetadata,
  BadRequestException,
  ValidationPipe,
} from '@nestjs/common';

import { AddPersonDto } from './add-person.dto';
import {
  AdministratorEntity,
  PersonEntity,
  StudentEntity,
  TeacherEntity,
} from '../entities';
import { UnknownRoleError } from '../errors';
import { AddPersonDtoBase } from './add-person-base.dto';

describe('AddPersonDto', () => {
  // ------------------------------------
  // Test suite for format
  // ------------------------------------
  describe('format', () => {
    let expected: AddPersonDto;

    beforeEach(() => {
      expected = new AddPersonDto();
      expected.name = 'trevelyan';
      expected.role = 'head of janus';
    });

    it('should do nothing', () => {
      const actual = new AddPersonDto();
      actual.name = 'trevelyan';
      actual.role = 'head of janus';

      actual.format();

      expect(actual).toEqual(expected);
    });

    it('should trim left', () => {
      const actual = new AddPersonDto();
      actual.name = '   trevelyan';
      actual.role = '    head of janus';

      actual.format();

      expect(actual).toEqual(expected);
    });

    it('should trim right', () => {
      const actual = new AddPersonDto();
      actual.name = 'trevelyan    ';
      actual.role = 'head of janus     ';

      actual.format();

      expect(actual).toEqual(expected);
    });

    it('should trim left and right', () => {
      const actual = new AddPersonDto();
      actual.name = '   trevelyan    ';
      actual.role = '     head of janus     ';

      actual.format();

      expect(actual).toEqual(expected);
    });

    it('should convert role to lowercase', () => {
      const actual = new AddPersonDto();
      actual.name = 'trevelyan';
      actual.role = 'heAD oF jaNus';

      actual.format();

      expect(actual).toEqual(expected);
    });

    it('should trim and convert role to lowercase', () => {
      const actual = new AddPersonDto();
      actual.name = ' trevelyan  ';
      actual.role = '    heAD oF jaNus  ';

      actual.format();

      expect(actual).toEqual(expected);
    });
  });

  // ------------------------------------
  // Test suite for toPersonEntity
  // ------------------------------------
  describe('toPersonEntity', () => {
    it('should create a student entity', () => {
      const expected: PersonEntity = new StudentEntity('mishkin');

      const dto = new AddPersonDto();
      dto.name = 'mishkin';
      dto.role = 'student';

      const actual = dto.toPersonEntity();

      expect(actual).toBeInstanceOf(StudentEntity);
      expect(actual).toEqual(expected);
    });

    it('should create a teacher entity', () => {
      const expected: PersonEntity = new TeacherEntity('boris');

      const dto = new AddPersonDto();
      dto.name = 'boris';
      dto.role = 'teacher';

      const actual = dto.toPersonEntity();

      expect(actual).toBeInstanceOf(TeacherEntity);
      expect(actual).toEqual(expected);
    });

    it('should create an administrator entity', () => {
      const expected: PersonEntity = new AdministratorEntity('james');

      const dto = new AddPersonDto();
      dto.name = 'james';
      dto.role = 'administrator';

      const actual = dto.toPersonEntity();

      expect(actual).toBeInstanceOf(AdministratorEntity);
      expect(actual).toEqual(expected);
    });

    it('should throw an error due to unknown role', () => {
      const dto = new AddPersonDto();
      dto.name = 'trevelyan';
      dto.role = 'head of janus';

      // need to encapsulate called function into another one, otherwise Jest can't test the error and the test will
      // fail
      const ref = () => {
        dto.toPersonEntity();
      };
      expect(ref).toThrow(UnknownRoleError);
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
        metatype: AddPersonDto,
        data: '',
      };
    });

    it('Should be OK', () => {
      const dto = createMock<AddPersonDtoBase>();
      dto.name = 'james';
      dto.role = 'administrator';

      const transformResult: Promise<AddPersonDtoBase> = validator.transform(
        dto,
        metadata,
      );

      expect(transformResult).resolves.not.toThrow();
    });

    it('Should be OK in spite of bad role specified', () => {
      const dto = createMock<AddPersonDtoBase>();
      dto.name = 'jaws';
      dto.role = 'bounty hunter';

      const transformResult: Promise<AddPersonDtoBase> = validator.transform(
        dto,
        metadata,
      );

      expect(transformResult).resolves.not.toThrow();
    });

    it('Should throw due to empty name', () => {
      const dto = createMock<AddPersonDtoBase>();
      dto.name = '';
      dto.role = 'administrator';

      const transformResult: Promise<AddPersonDtoBase> = validator.transform(
        dto,
        metadata,
      );

      expect(transformResult).rejects.toThrow(BadRequestException);
    });

    it('Should throw due to name too short', () => {
      const dto = createMock<AddPersonDtoBase>();
      dto.name = 'j';
      dto.role = 'administrator';

      const transformResult: Promise<AddPersonDtoBase> = validator.transform(
        dto,
        metadata,
      );

      expect(transformResult).rejects.toThrow(BadRequestException);
    });

    it('Should throw due to name too long', () => {
      const dto = createMock<AddPersonDtoBase>();
      dto.name =
        'jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj';
      dto.role = 'administrator';

      const transformResult: Promise<AddPersonDtoBase> = validator.transform(
        dto,
        metadata,
      );

      expect(transformResult).rejects.toThrow(BadRequestException);
    });

    it('Should throw due to empty role', () => {
      const dto = createMock<AddPersonDtoBase>();
      dto.name = 'james';
      dto.role = '';

      const transformResult: Promise<AddPersonDtoBase> = validator.transform(
        dto,
        metadata,
      );

      expect(transformResult).rejects.toThrow(BadRequestException);
    });
  });
});
