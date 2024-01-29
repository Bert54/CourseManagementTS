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
import { AddCourseDto } from '../dto';
import { CoursesService } from '../services';
import {
  CheckPermission,
  CheckPermissionGuard,
} from '../../common/modules/authorization';
import {
  CLASS_COURSE_FETCH,
  COURSE_CREATE,
  COURSE_FETCH,
  HEADER_WITH_PERSON_ID,
} from '../../../common/constants';
import { NumericIdValidator } from '../../../common/validators';

@Controller('/courses')
export class CoursesController {
  constructor(private coursesService: CoursesService) {}
  @Post()
  @UseGuards(CheckPermissionGuard)
  @CheckPermission(COURSE_CREATE)
  addCourse(
    @Headers(HEADER_WITH_PERSON_ID) personId: string,
    @Body() addCourseDto: AddCourseDto,
  ): Promise<CourseEntity> {
    return this.coursesService.addCourse(Number(personId), addCourseDto);
  }

  @Get()
  @UseGuards(CheckPermissionGuard)
  @CheckPermission(COURSE_FETCH)
  getAllOwnCourses(
    @Headers(HEADER_WITH_PERSON_ID) personId: string,
  ): Promise<CourseEntity[]> {
    return this.coursesService.getAllOwnCourses(Number(personId));
  }

  @Get('/:id')
  @UseGuards(CheckPermissionGuard)
  @CheckPermission(COURSE_FETCH)
  getOneCourse(
    @Headers(HEADER_WITH_PERSON_ID) personId: string,
    @Param() id: NumericIdValidator,
  ): Promise<CourseEntity> {
    return this.coursesService.getOneOwnCourse(id.id, Number(personId));
  }

  @Get('/own/classes')
  @UseGuards(CheckPermissionGuard)
  @CheckPermission(CLASS_COURSE_FETCH)
  getAllCoursesFromOwnClass(
    @Headers(HEADER_WITH_PERSON_ID) personId: string,
  ): Promise<CourseEntity[]> {
    return this.coursesService.getAllCoursesFromOwnClass(Number(personId));
  }
}
