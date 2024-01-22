import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { LoggerService } from '../../../common';
import { CourseBaseEntity } from '../entities';

@Injectable()
export class CoursesDao {
  constructor(
    @InjectRepository(CourseBaseEntity)
    private coursesRepository: Repository<CourseBaseEntity>,
    private logger: LoggerService,
  ) {}

  async save(course: CourseBaseEntity): Promise<CourseBaseEntity> {
    return await this.coursesRepository
      .save<CourseBaseEntity>(course)
      .catch((error) => {
        this.logger.warn(
          `Could not save new course [error: '${error.message}']`,
        );
        throw error;
      });
  }
}
