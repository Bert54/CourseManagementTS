import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { LoggerService } from '../../../common';
import { CourseEntity } from '../entities';

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
        this.logger.warn(
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
}
