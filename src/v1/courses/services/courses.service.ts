import { Injectable } from '@nestjs/common';
import { CoursesDao } from '../dao';
import { AddCourseBaseDto } from '../dto';
import { CourseEntity } from '../entities';

@Injectable()
export class CoursesService {
  constructor(private coursesDao: CoursesDao) {}

  addCourse(
    teacherId: string | number,
    addCourseDto: AddCourseBaseDto,
  ): Promise<CourseEntity> {
    return this.coursesDao.save(addCourseDto.toCourseEntity(teacherId));
  }

  getAllOwnCourses(teacherId: number): Promise<CourseEntity[]> {
    return this.coursesDao.findAllByTeacherId(teacherId);
  }

  getOneOwnCourse(courseId: number, teacherId: number): Promise<CourseEntity> {
    return this.coursesDao.findOne(courseId, teacherId);
  }
}
