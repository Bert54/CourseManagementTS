import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';

import { CoursesService } from './courses.service';
import { PeopleService, PersonEntity } from '../../people';
import { CourseEntity } from '../entities';
import { AddCourseBaseDto } from '../dto';
import { CoursesDao } from '../dao';
import { ClassesMembershipService, ClassesService } from '../../classes';
import { ClassEntity, ClassMembershipEntity } from '../../classes/entities';
import { NotFoundError } from '../../common/errors';
import { CourseCreationForbiddenError } from '../errors';

describe('CoursesService', () => {
  let coursesService: CoursesService;
  let coursesDao: DeepMocked<CoursesDao>;
  let membershipsService: DeepMocked<ClassesMembershipService>;
  let classesService: DeepMocked<ClassesService>;
  let peopleService: DeepMocked<PeopleService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursesService,
        {
          provide: CoursesDao,
          useValue: createMock<CoursesDao>(),
        },
        {
          provide: ClassesService,
          useValue: createMock<ClassesService>(),
        },
        {
          provide: ClassesMembershipService,
          useValue: createMock<ClassesMembershipService>(),
        },
        {
          provide: PeopleService,
          useValue: createMock<PeopleService>(),
        },
      ],
    }).compile();

    coursesService = module.get(CoursesService);
    coursesDao = module.get(CoursesDao);
    membershipsService = module.get(ClassesMembershipService);
    classesService = module.get(ClassesService);
    peopleService = module.get(PeopleService);
  });

  // ------------------------------------
  // Test suite for addCourse
  // ------------------------------------
  describe('addCourse', () => {
    it('should return a successfully added course', async () => {
      const course = createMock<CourseEntity>();
      course.id = 1;
      course.teacher_id = 3;
      course.student_class = 'MI6';
      course.title = 'How to be a secret agent';
      course.content = 'Just';

      const dto = createMock<AddCourseBaseDto>();
      dto.student_class = 'MI6';
      dto.title = 'How to be a secret agent';
      dto.content = 'Just';
      dto.toCourseEntity.mockReturnValue(course);

      coursesDao.save.mockResolvedValue(course);
      membershipsService.checkMembership.mockResolvedValue(true);
      classesService.getClass.mockResolvedValue(createMock<ClassEntity>());

      const gottenCourse = await coursesService.addCourse(3, dto);

      expect(classesService.getClass).toHaveBeenCalledTimes(1);
      expect(membershipsService.checkMembership).toHaveBeenCalledTimes(1);
      expect(dto.toCourseEntity).toHaveBeenCalledTimes(1);
      expect(coursesDao.save).toHaveBeenCalledTimes(1);
      expect(gottenCourse).toBe(course);
    });

    it('should return an error if class was not found', async () => {
      const dto = createMock<AddCourseBaseDto>();
      dto.student_class = 'MI6';
      dto.title = 'How to be a secret agent';
      dto.content = 'Just';

      classesService.getClass.mockImplementation(() => {
        return Promise.reject(new NotFoundError('class not found'));
      });

      await expect(coursesService.addCourse(3, dto)).rejects.toThrow(
        NotFoundError,
      );
      expect(classesService.getClass).toHaveBeenCalledTimes(1);
      expect(membershipsService.checkMembership).toHaveBeenCalledTimes(0);
      expect(dto.toCourseEntity).toHaveBeenCalledTimes(0);
      expect(coursesDao.save).toHaveBeenCalledTimes(0);
    });

    it('should return an error if person is not a member of class', async () => {
      const dto = createMock<AddCourseBaseDto>();
      dto.student_class = 'MI6';
      dto.title = 'How to be a secret agent';
      dto.content = 'Just';

      classesService.getClass.mockResolvedValue(createMock<ClassEntity>());
      membershipsService.checkMembership.mockResolvedValue(false);

      await expect(coursesService.addCourse(3, dto)).rejects.toThrow(
        CourseCreationForbiddenError,
      );
      expect(classesService.getClass).toHaveBeenCalledTimes(1);
      expect(membershipsService.checkMembership).toHaveBeenCalledTimes(1);
      expect(dto.toCourseEntity).toHaveBeenCalledTimes(0);
      expect(coursesDao.save).toHaveBeenCalledTimes(0);
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

      coursesDao.findAllByTeacherId.mockResolvedValue([
        course1,
        course2,
        course3,
      ]);

      expect(coursesService.getAllOwnCourses(1)).resolves.toStrictEqual<
        CourseEntity[]
      >([course1, course2, course3]);
      expect(coursesDao.findAllByTeacherId).toHaveBeenCalledTimes(1);
    });

    it('should return no errors if there are no results', () => {
      coursesDao.findAllByTeacherId.mockResolvedValue([]);

      expect(coursesService.getAllOwnCourses(1)).resolves.toStrictEqual<
        CourseEntity[]
      >([]);
      expect(coursesDao.findAllByTeacherId).toHaveBeenCalledTimes(1);
    });
  });

  // ------------------------------------
  // Test suite for getOneOwnCourse
  // ------------------------------------
  describe('getOneOwnCourse', () => {
    it('should return a course', () => {
      const course = createMock<CourseEntity>();
      course.id = 1;
      course.title = 'How to be a secret agent';
      course.content = 'Just';

      coursesDao.findOne.mockResolvedValue(course);

      expect(coursesService.getOneOwnCourse(1, 1)).resolves.toStrictEqual(
        course,
      );
      expect(coursesDao.findOne).toHaveBeenCalledTimes(1);
    });
    it('should return an error if repository throws an error', () => {
      coursesDao.findOne.mockImplementation(() => {
        return Promise.reject(new NotFoundError('class not found'));
      });

      expect(coursesService.getOneOwnCourse(1, 1)).rejects.toThrow(
        NotFoundError,
      );
      expect(coursesDao.findOne).toHaveBeenCalledTimes(1);
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

      const cls = createMock<ClassEntity>();
      cls.courses = [course1, course2];

      const membership = createMock<ClassMembershipEntity>();
      membership.class_info = cls;

      const person = createMock<PersonEntity>();
      person.id = 1;
      person.memberships = [membership];

      peopleService.getPerson.mockResolvedValue(person);

      expect(
        coursesService.getAllCoursesFromOwnClass(1),
      ).resolves.toStrictEqual([course1, course2]);
      expect(peopleService.getPerson).toHaveBeenCalledTimes(1);
    });

    it('should return no errors if a person was found but has no classes', () => {
      const person = createMock<PersonEntity>();
      person.id = 1;
      person.memberships = [];

      peopleService.getPerson.mockResolvedValue(person);

      expect(
        coursesService.getAllCoursesFromOwnClass(1),
      ).resolves.toStrictEqual([]);
      expect(peopleService.getPerson).toHaveBeenCalledTimes(1);
    });

    it('should return an error if peopleService returns an error', () => {
      peopleService.getPerson.mockImplementation(() => {
        return Promise.reject(new NotFoundError('class not found'));
      });

      expect(coursesService.getAllCoursesFromOwnClass(1)).rejects.toThrow(
        NotFoundError,
      );
      expect(peopleService.getPerson).toHaveBeenCalledTimes(1);
    });
  });
});
