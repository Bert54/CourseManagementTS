import { AddCourseBaseDto } from './add-course-base.dto';
import { CourseEntity } from '../entities';

export class AddCourseDto extends AddCourseBaseDto {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  toCourseEntity(teacherId: string | number): CourseEntity {
    this.format();
    let tId: number;
    if (typeof teacherId === 'string') {
      tId = Number(teacherId);
    } else {
      tId = teacherId;
    }
    return new CourseEntity(tId, this.student_class, this.title, this.content);
  }
}