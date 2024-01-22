import { Controller, Post } from '@nestjs/common';

import { CourseBaseEntity } from '../entitites';

@Controller('/courses')
export class CoursesController {
  @Post()
  addCourse(): CourseBaseEntity {
    return null;
  }
}
