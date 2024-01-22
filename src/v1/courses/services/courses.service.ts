import { Injectable } from '@nestjs/common';
import { CoursesDao } from '../dao';
import { AddCourseBaseDto } from '../dto';
import { CourseBaseEntity } from '../entities';

@Injectable()
export class CoursesService {
  constructor(private coursesDao: CoursesDao) {}

  addCourse(
    teacherId: string | number,
    addCourseDto: AddCourseBaseDto,
  ): Promise<CourseBaseEntity> {
    return this.coursesDao.save(addCourseDto.toCourseEntity(teacherId));
  }
}
