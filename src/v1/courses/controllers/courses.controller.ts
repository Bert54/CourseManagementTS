import {
  Body,
  Headers,
  Controller,
  Post,
  UseGuards,
  Get,
  Param,
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
  NumericIdValidator,
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
    let tId: number;
    if (typeof personId == 'string') {
      tId = Number(personId);
    } else {
      tId = personId;
    }
    return this.coursesService
      .getAllOwnCourses(tId)
      .catch((error: BaseError) => {
        throw handleError(error);
      });
  }

  @Get('/:id')
  @UseGuards(CheckPermissionGuard)
  @CheckPermission(COURSE_FETCH)
  getOneCourse(
    @Headers(headerWithPersonId) personId: string,
    @Param() id: NumericIdValidator,
  ): Promise<CourseEntity> {
    let tId: number;
    if (typeof personId == 'string') {
      tId = Number(personId);
    } else {
      tId = personId;
    }
    return this.coursesService
      .getOneOwnCourse(id.id, tId)
      .catch((error: BaseError) => {
        throw handleError(error);
      });
  }
}
