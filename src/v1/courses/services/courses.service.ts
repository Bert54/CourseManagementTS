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
}
