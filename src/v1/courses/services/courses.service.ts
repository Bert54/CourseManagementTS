import { Injectable } from '@nestjs/common';

import { CoursesDao } from '../dao';
import { AddCourseDto } from '../dto';
import { CourseEntity } from '../entities';
import { CourseCreationForbiddenError } from '../errors';
import {
  ClassesMembershipService,
  ClassesService,
} from '../../classes/services';
import { PeopleService } from '../../people/services';
import { PeopleRelationsEnum } from '../../people/enums';

@Injectable()
export class CoursesService {
  constructor(
    private coursesDao: CoursesDao,
    private classesMembership: ClassesService,
    private classesMembershipService: ClassesMembershipService,
    private peopleService: PeopleService,
  ) {}

  async addCourse(
    teacherId: number,
    addCourseDto: AddCourseDto,
  ): Promise<CourseEntity> {
    // First check for existence of class (used method throws an error if that's not the case)
    return await this.classesMembership
      .getClass(addCourseDto.student_class)
      // Then check if the person is a member of the class
      .then(async () => {
        await this.classesMembershipService
          .checkMembership(teacherId, addCourseDto.student_class)
          .then((isMember: boolean): void => {
            if (!isMember) {
              throw new CourseCreationForbiddenError(
                `Person is not allowed to create new courses for this class`,
              );
            }
            return undefined;
          });
      })
      // Finally perform the operation
      .then(
        async () =>
          await this.coursesDao.save(addCourseDto.toCourseEntity(teacherId)),
      );
  }

  getAllOwnCourses(teacherId: number): Promise<CourseEntity[]> {
    return this.coursesDao.findAllByTeacherId(teacherId);
  }

  getOneOwnCourse(courseId: number, teacherId: number): Promise<CourseEntity> {
    return this.coursesDao.findOne(courseId, teacherId);
  }

  async getAllCoursesFromOwnClass(personId: number): Promise<CourseEntity[]> {
    const person = await this.peopleService.getPerson(
      {
        id: personId,
      },
      [
        PeopleRelationsEnum.Memberships,
        PeopleRelationsEnum.Memberships_ClassInfo,
        PeopleRelationsEnum.Memberships_ClassInfo_Courses,
      ],
    );
    const courses: CourseEntity[] = [];
    if (!!person.memberships) {
      person.memberships.forEach((membership) => {
        courses.push(...membership.class_info.courses);
      });
    }
    return courses;
  }
}
