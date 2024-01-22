import { CourseBaseEntity } from '../entitites';

export abstract class AddCourseBaseDto {
  studentClass: string;

  title: string;

  content: string;

  format(): void {
    this.studentClass = this.studentClass.trim();
    this.title = this.title.trim();
    this.content = this.content.trim();
  }

  abstract toCourseEntity(teacherId: number): CourseBaseEntity;
}
