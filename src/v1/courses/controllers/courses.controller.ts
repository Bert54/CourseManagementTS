import {
  Body,
  Headers,
  Controller,
  Post,
  UseGuards,
  Get,
} from '@nestjs/common';

import { CourseEntity } from '../entities';
import {
  BaseError,
  CheckPermission,
  CheckPermissionGuard,
  handleError,
} from '../../common';
import {
  COURSE_CREATE,
  COURSE_FETCH,
  headerWithPersonId,
} from '../../../common';
import { AddCourseDto } from '../dto';
import { CoursesService } from '../services';

@Controller('/courses')
export class CoursesController {
  constructor(private coursesService: CoursesService) {}
  @Post()
  @UseGuards(CheckPermissionGuard)
  @CheckPermission(COURSE_CREATE)
  addCourse(
    @Headers(headerWithPersonId) personId: string,
    @Body() addCourseDto: AddCourseDto,
  ): Promise<CourseEntity> {
    return this.coursesService
      .addCourse(personId, addCourseDto)
      .catch((error: BaseError) => {
        throw handleError(error);
      });
  }

  @Get()
  @UseGuards(CheckPermissionGuard)
  @CheckPermission(COURSE_FETCH)
  getAllOwnCourses(
    @Headers(headerWithPersonId) personId: string,
  ): Promise<CourseEntity[]> {
    return this.coursesService
      .getAllOwnCourses(personId)
      .catch((error: BaseError) => {
        throw handleError(error);
      });
  }
}
