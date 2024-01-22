import { AddCourseBaseDto } from './add-course-base.dto';
import { CourseBaseEntity } from '../entitites';

export class AddCourseDto extends AddCourseBaseDto {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  toCourseEntity(teacherId: number): CourseBaseEntity {
    return undefined;
  }
}
