import { Controller, Post, UseGuards } from '@nestjs/common';

import { CourseBaseEntity } from '../entitites';
import { CheckPermission, CheckPermissionGuard } from '../../common';
import { COURSE_CREATE } from '../../../common';

@Controller('/courses')
export class CoursesController {
  @Post()
  @UseGuards(CheckPermissionGuard)
  @CheckPermission(COURSE_CREATE)
  addCourse(): CourseBaseEntity {
    return null;
  }
}
