import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';

import { ClassesDao } from '../dao';
import { ClassesService } from './classes.service';
import { ClassEntity, ClassMembershipEntity } from '../entities';
import { AddClassDto } from '../dto';
import { ClassAlreadyExistsError, ClassNotFoundError } from '../errors';
import { PersonEntity } from '../../people';

describe('ClassesService', () => {
  let classesService: ClassesService;
  let classesDao: DeepMocked<ClassesDao>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClassesService,
        {
          provide: ClassesDao,
          useValue: createMock<ClassesDao>(),
        },
      ],
    }).compile();

    classesService = module.get(ClassesService);
    classesDao = module.get(ClassesDao);
  });

  // ------------------------------------
  // Test suite for addClass
  // ------------------------------------
  describe('addClass', () => {
    it('should return the new class', () => {
      const cls = createMock<ClassEntity>();
      cls.id = 7;
      cls.name = 'MI6';

      const dto = createMock<AddClassDto>();
      dto.name = 'MI6';

      classesDao.save.mockReturnValue(new Promise<ClassEntity>(() => cls));

      expect(classesService.addClass(dto)).resolves.toStrictEqual(cls);
      expect(classesDao.save).toHaveBeenCalledTimes(1);
    });

    it('should throw error if service throws an error', () => {
      const dto = createMock<AddClassDto>();
      dto.name = 'MI6';

      classesDao.save.mockImplementation(() => {
        return Promise.reject(
          new ClassAlreadyExistsError('class already exists'),
        );
      });

      expect(classesService.addClass(dto)).rejects.toThrow(
        ClassAlreadyExistsError,
      );
      expect(classesService.addClass(dto)).rejects.toStrictEqual(
        new ClassAlreadyExistsError('class already exists'),
      );
      expect(classesDao.save).toHaveBeenCalledTimes(2);
    });
  });

  // ------------------------------------
  // Test suite for getClass
  // ------------------------------------
  describe('getClass', () => {
    it('should successfully return a class with members', () => {
      const person1 = createMock<PersonEntity>();
      person1.id = 1;
      person1.name = 'James';
      const membership1 = createMock<ClassMembershipEntity>();
      membership1.person = person1;

      const person2 = createMock<PersonEntity>();
      person2.id = 2;
      person2.name = 'Q';
      const membership2 = createMock<ClassMembershipEntity>();
      membership2.person = person2;

      const originalClass = createMock<ClassEntity>();
      originalClass.id = 7;
      originalClass.name = 'MI6';
      originalClass.members_cls = [membership1, membership2];

      const expectedClass = createMock<ClassEntity>();
      expectedClass.id = 7;
      expectedClass.name = 'MI6';
      expectedClass.members = [person1, person2];

      classesDao.findOneByName.mockReturnValue(
        new Promise<ClassEntity>(() => originalClass),
      );

      expect(classesService.getClass('MI6')).resolves.toStrictEqual(
        expectedClass,
      );
      expect(classesDao.findOneByName).toHaveBeenCalledTimes(1);
    });

    it('should successfully return a class without members', () => {
      const expectedClass = createMock<ClassEntity>();
      expectedClass.id = 7;
      expectedClass.name = 'MI6';

      classesDao.findOneByName.mockReturnValue(
        new Promise<ClassEntity>(() => expectedClass),
      );

      expect(classesService.getClass('MI6')).resolves.toStrictEqual(
        expectedClass,
      );
      expect(classesDao.findOneByName).toHaveBeenCalledTimes(1);
    });

    it('should throw error if service throws an error', () => {
      classesDao.findOneByName.mockImplementation(() => {
        return Promise.reject(new ClassNotFoundError('class was not found'));
      });

      expect(classesService.getClass('MI6')).rejects.toThrow(
        ClassNotFoundError,
      );
      expect(classesService.getClass('MI6')).rejects.toStrictEqual(
        new ClassNotFoundError('class was not found'),
      );
      expect(classesDao.findOneByName).toHaveBeenCalledTimes(2);
    });
  });

  // ------------------------------------
  // Test suite for removeClass
  // ------------------------------------
  describe('removeClass', () => {
    it('should return the removed class', () => {
      const cls = createMock<ClassEntity>();
      cls.id = 7;
      cls.name = 'MI6';

      classesDao.deleteOneByName.mockReturnValue(
        new Promise<ClassEntity>(() => cls),
      );

      expect(classesService.removeClass('MI6')).resolves.toStrictEqual(cls);
      expect(classesDao.deleteOneByName).toHaveBeenCalledTimes(1);
    });

    it('should throw error if service throws an error', () => {
      classesDao.deleteOneByName.mockImplementation(() => {
        return Promise.reject(new ClassNotFoundError('class was not found'));
      });

      expect(classesService.removeClass('MI6')).rejects.toThrow(
        ClassNotFoundError,
      );
      expect(classesService.removeClass('MI6')).rejects.toStrictEqual(
        new ClassNotFoundError('class was not found'),
      );
      expect(classesDao.deleteOneByName).toHaveBeenCalledTimes(2);
    });
  });
});
