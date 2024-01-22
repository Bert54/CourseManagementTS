import { CourseBaseEntity } from './course-base.entity';
import { Entity } from 'typeorm';

@Entity()
export class CourseEntity extends CourseBaseEntity {
  constructor(
    teacher_id: number,
    student_class: string,
    title: string,
    content: string,
  ) {
    super(teacher_id, student_class, title, content);
  }
}
