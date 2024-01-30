import {
  ArgumentMetadata,
  BadRequestException,
  ValidationPipe,
} from '@nestjs/common';
import { createMock } from '@golevelup/ts-jest';

import { AddCourseDto } from './add-course.dto';
import { CourseEntity } from '../entities';
import { AddCourseBaseDto } from './add-course-base.dto';
import { AddPersonDtoBase } from '../../people';

describe('AddCourseDto', () => {
  // ------------------------------------
  // Test suite for format
  // ------------------------------------
  describe('format', () => {
    let expected: AddCourseDto;

    beforeEach(async () => {
      expected = new AddCourseDto();
      expected.student_class = 'MI6';
      expected.title = 'How to be a good secret agent';
      expected.content = `It's a secret!`;
    });

    it('should do nothing', () => {
      const actual = new AddCourseDto();
      actual.student_class = 'MI6';
      actual.title = 'How to be a good secret agent';
      actual.content = `It's a secret!`;

      actual.format();

      expect(actual).toEqual(expected);
    });

    it('should trim', () => {
      const actual = new AddCourseDto();
      actual.student_class = '  MI6      ';
      actual.title = 'How to be a good secret agent    ';
      actual.content = `  It's a secret!`;

      actual.format();

      expect(actual).toEqual(expected);
    });
  });

  // ------------------------------------
  // Test suite for toCourseEntity
  // ------------------------------------
  describe('toPersonEntity', () => {
    it('should work', () => {
      const expected = new CourseEntity(
        1,
        'MI6',
        'How to be a good secret agent',
        `It's a secret!`,
      );

      const dto = new AddCourseDto();
      dto.student_class = 'MI6';
      dto.title = 'How to be a good secret agent';
      dto.content = `It's a secret!`;

      expect(dto.toCourseEntity(1)).toEqual(expected);
    });
  });

  // ------------------------------------
  // Test suite for Dto Validation
  // ------------------------------------
  describe('Dto validation', () => {
    let validator: ValidationPipe;
    let metadata: ArgumentMetadata;

    beforeEach(async () => {
      validator = new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      });
      metadata = {
        type: 'body',
        metatype: AddCourseDto,
        data: '',
      };
    });

    it('should be OK', () => {
      const dto = createMock<AddCourseBaseDto>();
      dto.student_class = 'MI6';
      dto.title = 'How to be a good secret agent';
      dto.content = `It's a secret!`;

      const transformResult: Promise<AddPersonDtoBase> = validator.transform(
        dto,
        metadata,
      );

      expect(transformResult).resolves.not.toThrow();
    });

    it('should fail due to empty class', () => {
      const dto = createMock<AddCourseBaseDto>();
      dto.student_class = '';
      dto.title = 'How to be a good secret agent';
      dto.content = `It's a secret!`;

      const transformResult: Promise<AddPersonDtoBase> = validator.transform(
        dto,
        metadata,
      );

      expect(transformResult).rejects.toThrow(BadRequestException);
    });

    it('should fail due to class name too long', () => {
      const dto = createMock<AddCourseBaseDto>();
      dto.student_class = 'MI6666666666666666666666666666666666666666666666';
      dto.title = 'How to be a good secret agent';
      dto.content = `It's a secret!`;

      const transformResult: Promise<AddPersonDtoBase> = validator.transform(
        dto,
        metadata,
      );

      expect(transformResult).rejects.toThrow(BadRequestException);
    });

    it('should fail due to empty title', () => {
      const dto = createMock<AddCourseBaseDto>();
      dto.student_class = 'MI6';
      dto.title = '';
      dto.content = `It's a secret!`;

      const transformResult: Promise<AddPersonDtoBase> = validator.transform(
        dto,
        metadata,
      );

      expect(transformResult).rejects.toThrow(BadRequestException);
    });

    it('should fail due to title too short', () => {
      const dto = createMock<AddCourseBaseDto>();
      dto.student_class = 'MI6';
      dto.title = '';
      dto.content = `It's a secret!`;

      const transformResult: Promise<AddPersonDtoBase> = validator.transform(
        dto,
        metadata,
      );

      expect(transformResult).rejects.toThrow(BadRequestException);
    });

    it('should fail due to title too long', () => {
      const dto = createMock<AddCourseBaseDto>();
      dto.student_class = 'MI6';
      dto.title =
        'How to be a good secret agentHow to be a good secret agentHow to be a good secret agentHow to be a good secret agentHow to be a good secret agentHow to be a good secret agentHow to be a good secret agent';
      dto.content = `It's a secret!`;

      const transformResult: Promise<AddPersonDtoBase> = validator.transform(
        dto,
        metadata,
      );

      expect(transformResult).rejects.toThrow(BadRequestException);
    });

    it('should fail due to empty content', () => {
      const dto = createMock<AddCourseBaseDto>();
      dto.student_class = 'MI6';
      dto.title = 'How to be a good secret agent';
      dto.content = ``;

      const transformResult: Promise<AddPersonDtoBase> = validator.transform(
        dto,
        metadata,
      );

      expect(transformResult).rejects.toThrow(BadRequestException);
    });
  });
});
