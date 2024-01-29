import { Injectable } from '@nestjs/common';

import { CoursesDao } from '../dao';
import { AddCourseBaseDto } from '../dto';
import { CourseEntity } from '../entities';
import { ClassesMembershipService, ClassesService } from '../../classes';
import { CourseCreationForbiddenError } from '../errors';
import { PeopleService } from '../../people';

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
    addCourseDto: AddCourseBaseDto,
  ): Promise<CourseEntity> {
    // First check for existence of class
    const checkClassPromise = await Promise.resolve(
      this.classesMembership.getClass(addCourseDto.student_class),
    );
    // Then check if the person is a member of the class
    const checkMembershipPromise = await Promise.resolve(
      this.classesMembershipService
        .checkMembership(teacherId, addCourseDto.student_class)
        .then((isMember: boolean): void => {
          if (!isMember) {
            throw new CourseCreationForbiddenError(
              `Person is not allowed to create new courses for this class`,
            );
          }
          return undefined;
        }),
    );
    // Finally perform the operation
    const addCoursePromise = await Promise.resolve(
      this.coursesDao.save(addCourseDto.toCourseEntity(teacherId)),
    );

    return await Promise.all([
      checkClassPromise,
      checkMembershipPromise,
      addCoursePromise,
    ]).then((values) => {
      return values[2];
    });
  }

  getAllOwnCourses(teacherId: number): Promise<CourseEntity[]> {
    return this.coursesDao.findAllByTeacherId(teacherId);
  }

  getOneOwnCourse(courseId: number, teacherId: number): Promise<CourseEntity> {
    return this.coursesDao.findOne(courseId, teacherId);
  }

  getAllCoursesFromOwnClass(personId: number): Promise<CourseEntity[]> {
    return this.peopleService
      .getPerson({
        id: personId,
      })
      .then((person) => {
        const courses: CourseEntity[] = [];
        person.memberships.forEach((membership) => {
          courses.push(...membership.class_info.courses);
        });
        return courses;
      });
  }
}
