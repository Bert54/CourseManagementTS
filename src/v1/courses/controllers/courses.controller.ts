import { Body, Headers, Controller, Post, UseGuards } from '@nestjs/common';

import { CourseEntity } from '../entities';
import {
  BaseError,
  CheckPermission,
  CheckPermissionGuard,
  handleError,
} from '../../common';
import { COURSE_CREATE, headerWithPersonId } from '../../../common';
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
}
