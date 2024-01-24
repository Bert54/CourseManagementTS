import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { QueryFailedError, Repository } from 'typeorm';

import { LoggerService } from '../../../common';
import { CourseEntity } from '../entities';
import { CourseNotFoundError } from '../errors';
import { BadRequestError } from '../../common';

@Injectable()
export class CoursesDao {
  constructor(
    @InjectRepository(CourseEntity)
    private coursesRepository: Repository<CourseEntity>,
    private logger: LoggerService,
  ) {}

  async save(course: CourseEntity): Promise<CourseEntity> {
    return await this.coursesRepository
      .save<CourseEntity>(course)
      .catch((error) => {
        // can only be thrown because of fk constraint referencing class.name
        if (error.constructor === QueryFailedError) {
          error = new BadRequestError(
            `Class with name '${course.student_class}' does not exist`,
          );
        }
        this.logger.log(
          `Could not save new course [error: '${error.message}']`,
        );
        throw error;
      });
  }

  async findAllByTeacherId(teacherId: number): Promise<CourseEntity[]> {
    return await this.coursesRepository.findBy({
      teacher_id: teacherId,
    });
  }

  async findOne(courseId: number, teacherId: number): Promise<CourseEntity> {
    return await this.coursesRepository
      .findOneBy({
        id: courseId,
        teacher_id: teacherId,
      })
      .then((course: CourseEntity) => {
        if (!course) {
          throw new CourseNotFoundError(
            `Course with id '${courseId}' for person with id '${teacherId}' was not found`,
          );
        }
        return course;
      })
      .catch((error) => {
        this.logger.log(`Could not fetch course [error: '${error.message}']`);
        throw error;
      });
  }
}
