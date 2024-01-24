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
import { CheckPermission, CheckPermissionGuard } from '../../common';
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
    return this.coursesService.addCourse(Number(personId), addCourseDto);
  }

  @Get()
  @UseGuards(CheckPermissionGuard)
  @CheckPermission(COURSE_FETCH)
  getAllOwnCourses(
    @Headers(headerWithPersonId) personId: string,
  ): Promise<CourseEntity[]> {
    return this.coursesService.getAllOwnCourses(Number(personId));
  }

  @Get('/:id')
  @UseGuards(CheckPermissionGuard)
  @CheckPermission(COURSE_FETCH)
  getOneCourse(
    @Headers(headerWithPersonId) personId: string,
    @Param() id: NumericIdValidator,
  ): Promise<CourseEntity> {
    return this.coursesService.getOneOwnCourse(id.id, Number(personId));
  }
}
