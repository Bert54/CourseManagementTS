import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';

import { CoursesService } from './courses.service';
import { PeopleService } from '../../people';
import { CourseEntity } from '../entities';
import { AddCourseBaseDto } from '../dto';
import { CoursesDao } from '../dao';
import { ClassesMembershipService, ClassesService } from '../../classes';
import { ClassEntity } from '../../classes/entities';

describe('CoursesService', () => {
  let coursesService: CoursesService;
  let coursesDao: DeepMocked<CoursesDao>;
  let membershipsService: DeepMocked<ClassesMembershipService>;
  let classesService: DeepMocked<ClassesService>;

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
  });
});
