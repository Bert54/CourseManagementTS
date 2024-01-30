import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';

import { CoursesController } from './courses.controller';
import { CoursesService } from '../services';
import { CheckPermissionService } from '../../common/modules/authorization';
import { CourseEntity } from '../entities';
import { AddCourseBaseDto } from '../dto';
import { CourseAlreadyExistsError, CourseNotFoundError } from '../errors';

const getCourseMockImplementation = (
  course1: CourseEntity,
  course2: CourseEntity,
  course3: CourseEntity,
) => {
  return (personId: number, courseId: number): Promise<CourseEntity> => {
    let course: CourseEntity;
    if (course1.id == courseId && course1.teacher_id == personId) {
      course = course1;
    }
    if (course2.id == courseId && course2.teacher_id == personId) {
      course = course2;
    }
    if (course3.id == courseId && course3.teacher_id == personId) {
      course = course3;
    }

    return new Promise<CourseEntity>(() => course);
  };
};

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
      dto.content = 'Just';

      coursesService.addCourse.mockReturnValue(
        new Promise<CourseEntity>(() => course),
      );

      const gottenCourse = coursesController.addCourse('1', dto);

      expect(gottenCourse).resolves.toBe(course);
    });

    it('should throw an appropriate error if the course already exists', () => {
      coursesService.addCourse.mockImplementation(() => {
        return Promise.reject(
          new CourseAlreadyExistsError('course already exists'),
        );
      });

      const dto = createMock<AddCourseBaseDto>();
      dto.title = 'How to be a secret agent';
      dto.content = 'Just';

      expect(coursesController.addCourse('1', dto)).rejects.toThrow(
        CourseAlreadyExistsError,
      );

      expect(coursesController.addCourse('1', dto)).rejects.toStrictEqual(
        new CourseAlreadyExistsError('course already exists'),
      );
    });
  });

  // ------------------------------------
  // Test suite for getAllOwnCourses
  // ------------------------------------
  describe('getAllOwnCourses', () => {
    it('should return a list of courses', () => {
      const course1 = createMock<CourseEntity>();
      course1.id = 1;
      course1.title = 'How to be a secret agent';
      course1.content = 'Just';

      const course2 = createMock<CourseEntity>();
      course2.id = 2;
      course2.title = 'How to be an MI6 operator';
      course2.content = 'Tea';

      const course3 = createMock<CourseEntity>();
      course3.id = 3;
      course3.title = 'How to be part of Spectre';
      course3.content = 'Trauma';

      coursesService.getAllOwnCourses.mockReturnValue(
        new Promise<CourseEntity[]>(() => [course1, course2, course3]),
      );

      const gottenCourses = coursesController.getAllOwnCourses('1');

      expect(coursesService.getAllOwnCourses).toHaveBeenCalledTimes(1);
      expect(gottenCourses).resolves.toStrictEqual<CourseEntity[]>([
        course1,
        course2,
        course3,
      ]);
    });

    it('should return no errors if there are no courses', () => {
      coursesService.getAllOwnCourses.mockReturnValue(
        new Promise<CourseEntity[]>(() => []),
      );

      const gottenCourses = coursesController.getAllOwnCourses('1');

      expect(coursesService.getAllOwnCourses).toHaveBeenCalledTimes(1);
      expect(gottenCourses).resolves.toStrictEqual<CourseEntity[]>([]);
    });
  });

  // ------------------------------------
  // Test suite for getOneCourse
  // ------------------------------------
  describe('getOneCourse', () => {
    it('should return a course', () => {
      const course = createMock<CourseEntity>();
      course.id = 2;
      course.teacher_id = 1;
      course.title = 'How to be an MI6 operator';
      course.content = 'Tea';

      coursesService.getOneOwnCourse.mockReturnValue(
        new Promise<CourseEntity>(() => course),
      );

      const gottenCourse = coursesController.getOneCourse('2', { id: 1 });

      expect(coursesService.getOneOwnCourse).toHaveBeenCalledTimes(1);
      expect(gottenCourse).resolves.toStrictEqual(course);
    });

    it('should return a course based on person id and course id', () => {
      const course1 = createMock<CourseEntity>();
      course1.id = 1;
      course1.teacher_id = 1;
      course1.title = 'How to be a secret agent';
      course1.content = 'Just';

      const course2 = createMock<CourseEntity>();
      course2.id = 2;
      course2.teacher_id = 2;
      course2.title = 'How to be an MI6 operator';
      course2.content = 'Tea';

      const course3 = createMock<CourseEntity>();
      course3.id = 3;
      course3.teacher_id = 2;
      course3.title = 'How to be part of Spectre';
      course3.content = 'Trauma';

      coursesService.getOneOwnCourse.mockImplementation(
        getCourseMockImplementation(course1, course2, course3),
      );

      let gottenCourse = coursesController.getOneCourse('1', { id: 1 });
      expect(gottenCourse).resolves.toStrictEqual(course1);
      gottenCourse = coursesController.getOneCourse('3', { id: 2 });
      expect(gottenCourse).resolves.toStrictEqual(course3);
      expect(coursesService.getOneOwnCourse).toHaveBeenCalledTimes(2);
    });

    it('should throw an error', () => {
      coursesService.getOneOwnCourse.mockImplementation(() => {
        return Promise.reject(new CourseNotFoundError('course not found'));
      });

      expect(coursesController.getOneCourse('1', { id: 1 })).rejects.toThrow(
        CourseNotFoundError,
      );
      expect(
        coursesController.getOneCourse('1', { id: 1 }),
      ).rejects.toStrictEqual(new CourseNotFoundError('course not found'));
      expect(coursesService.getOneOwnCourse).toHaveBeenCalledTimes(2);
    });
  });

  // ------------------------------------
  // Test suite for getAllCoursesFromOwnClass
  // ------------------------------------
  describe('getAllCoursesFromOwnClass', () => {
    it('should return a list of courses', () => {
      const course1 = createMock<CourseEntity>();
      course1.id = 1;
      course1.title = 'How to be a secret agent';
      course1.content = 'Just';

      const course2 = createMock<CourseEntity>();
      course2.id = 2;
      course2.title = 'How to be an MI6 operator';
      course2.content = 'Tea';

      const course3 = createMock<CourseEntity>();
      course3.id = 3;
      course3.title = 'How to be part of Spectre';
      course3.content = 'Trauma';

      coursesService.getAllCoursesFromOwnClass.mockReturnValue(
        new Promise<CourseEntity[]>(() => [course1, course2, course3]),
      );

      const gottenCourses = coursesController.getAllCoursesFromOwnClass('1');

      expect(coursesService.getAllCoursesFromOwnClass).toHaveBeenCalledTimes(1);
      expect(gottenCourses).resolves.toStrictEqual<CourseEntity[]>([
        course1,
        course2,
        course3,
      ]);
    });

    it('should return no errors if there are no courses', () => {
      coursesService.getAllCoursesFromOwnClass.mockReturnValue(
        new Promise<CourseEntity[]>(() => []),
      );

      const gottenCourses = coursesController.getAllCoursesFromOwnClass('1');

      expect(coursesService.getAllCoursesFromOwnClass).toHaveBeenCalledTimes(1);
      expect(gottenCourses).resolves.toStrictEqual<CourseEntity[]>([]);
    });
  });
});
