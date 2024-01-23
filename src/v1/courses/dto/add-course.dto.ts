import { AddCourseBaseDto } from './add-course-base.dto';
import { CourseEntity } from '../entities';

export class AddCourseDto extends AddCourseBaseDto {
  toCourseEntity(teacherId: number): CourseEntity {
    this.format();
    return new CourseEntity(
      teacherId,
      this.student_class,
      this.title,
      this.content,
    );
  }
}
