import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';

import { ClassesController } from './classes.controller';
import { ClassesService } from '../services';
import { ClassEntity } from '../entities';
import { ClassAlreadyExistsError, ClassNotFoundError } from '../errors';
import { AddClassDto } from '../dto';
import { CheckPermissionService } from '../../common/modules/authorization/check-permission';

const getClassMockImplementation = (
  class1: ClassEntity,
  class2: ClassEntity,
  class3: ClassEntity,
) => {
  return (className: string): Promise<ClassEntity> => {
    let cls: ClassEntity;
    if (class1.name === className) {
      cls = class1;
    }
    if (class2.name === className) {
      cls = class2;
    }
    if (class3.name === className) {
      cls = class3;
    }
    return new Promise<ClassEntity>(() => cls);
  };
};

describe('ClassesController', () => {
  let classesController: ClassesController;
  let classesService: DeepMocked<ClassesService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClassesController],
      providers: [
        {
          provide: ClassesService,
          useValue: createMock<ClassesService>(),
        },
        {
          provide: CheckPermissionService,
          useValue: createMock<CheckPermissionService>(),
        },
      ],
    }).compile();

    classesController = module.get(ClassesController);
    classesService = module.get(ClassesService);
  });

  // ------------------------------------
  // Test suite for getClass
  // ------------------------------------
  describe('getClass', () => {
    it('should return a class', () => {
      const cls = createMock<ClassEntity>();
      cls.id = 7;
      cls.name = 'MI6';

      classesService.getClass.mockReturnValue(
        new Promise<ClassEntity>(() => cls),
      );

      const gottenClass = classesController.getClass('MI6');

      expect(classesService.getClass).toHaveBeenCalledTimes(1);
      expect(gottenClass).resolves.toStrictEqual(cls);
    });

    it('should return a class based on provided id', () => {
      const class1 = createMock<ClassEntity>();
      class1.id = 7;
      class1.name = 'MI6';

      const class2 = createMock<ClassEntity>();
      class2.id = 6;
      class2.name = 'Janus';

      const class3 = createMock<ClassEntity>();
      class3.id = 1;
      class3.name = 'Spectre';

      classesService.getClass.mockImplementation(
        getClassMockImplementation(class1, class2, class3),
      );

      let gottenClass = classesController.getClass('Spectre');

      expect(gottenClass).resolves.toStrictEqual(class3);

      gottenClass = classesController.getClass('Janus');

      expect(gottenClass).resolves.toStrictEqual(class2);

      expect(classesService.getClass).toHaveBeenCalledTimes(2);
    });

    it('should throw an error if service throws an error', () => {
      classesService.getClass.mockImplementation(() => {
        return Promise.reject(new ClassNotFoundError('class not found'));
      });

      expect(classesController.getClass('Boris fan club')).rejects.toThrow(
        ClassNotFoundError,
      );
      expect(
        classesController.getClass('Boris fan club'),
      ).rejects.toStrictEqual(new ClassNotFoundError('class not found'));
      expect(classesService.getClass).toHaveBeenCalledTimes(2);
    });
  });

  // ------------------------------------
  // Test suite for addClass
  // ------------------------------------
  describe('addClass', () => {
    it('should return a successfully added class', () => {
      const cls = createMock<ClassEntity>();
      cls.id = 7;
      cls.name = 'MI6';

      const dto = createMock<AddClassDto>();
      dto.name = 'MI6';

      classesService.addClass.mockReturnValue(
        new Promise<ClassEntity>(() => cls),
      );

      expect(classesController.addClass(dto)).resolves.toStrictEqual(cls);
      expect(classesService.addClass).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if service throws an error', () => {
      classesService.addClass.mockImplementation(() => {
        return Promise.reject(
          new ClassAlreadyExistsError('class already exists'),
        );
      });

      const dto = createMock<AddClassDto>();
      dto.name = 'MI6';

      expect(classesController.addClass(dto)).rejects.toThrow(
        ClassAlreadyExistsError,
      );
      expect(classesController.addClass(dto)).rejects.toStrictEqual(
        new ClassAlreadyExistsError('class already exists'),
      );
      expect(classesService.addClass).toHaveBeenCalledTimes(2);
    });
  });

  // ------------------------------------
  // Test suite for deleteClassByName
  // ------------------------------------
  describe('deleteClassByName', () => {
    it('should return the successfully deleted class', () => {
      const cls = createMock<ClassEntity>();
      cls.id = 7;
      cls.name = 'MI6';

      classesService.removeClass.mockReturnValue(
        new Promise<ClassEntity>(() => cls),
      );

      expect(classesController.deleteClassByName('MI6')).resolves.toStrictEqual(
        cls,
      );
      expect(classesService.removeClass).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if service throws an error', () => {
      classesService.removeClass.mockImplementation(() => {
        return Promise.reject(new ClassNotFoundError('class was not found'));
      });

      expect(classesController.deleteClassByName('MI6')).rejects.toThrow(
        ClassNotFoundError,
      );
      expect(classesController.deleteClassByName('MI6')).rejects.toStrictEqual(
        new ClassNotFoundError('class was not found'),
      );
      expect(classesService.removeClass).toHaveBeenCalledTimes(2);
    });
  });
});
