import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';

import { CoursesController } from './courses.controller';
import { CoursesService } from '../services';
import { CheckPermissionService } from '../../common/modules/authorization';
import { CourseEntity } from '../entities';
import { AddCourseBaseDto } from '../dto';

describe('CourseController', () => {
  let coursesController: CoursesController;
  let coursesService: DeepMocked<CoursesService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoursesController],
      providers: [
        {
          provide: CoursesService,
          useValue: createMock<CoursesService>(),
        },
        {
          provide: CheckPermissionService,
          useValue: createMock<CheckPermissionService>(),
        },
      ],
    }).compile();

    coursesController = module.get<CoursesController>(CoursesController);
    coursesService = module.get(CoursesService);
  });

  // ------------------------------------
  // Test suite for addCourse
  // ------------------------------------
  describe('addCourse', () => {
    it('should return a successfully added course', () => {
      const course = createMock<CourseEntity>();
      course.id = 1;
      course.title = 'How to be a secret agent';
      course.content = 'Just';

      const dto = createMock<AddCourseBaseDto>();
      dto.title = 'How to be a secret agent';
      course.content = 'Just';

      coursesService.addCourse.mockReturnValue(
        new Promise<CourseEntity>(() => course),
      );

      const gottenCourse = coursesController.addCourse('1', dto);

      expect(gottenCourse).resolves.toBe(course);
    });
  });
});
