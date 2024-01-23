import { CourseEntity } from '../entities';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export abstract class AddCourseBaseDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 30)
  student_class: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 200)
  title: string;

  @IsNotEmpty()
  @IsString()
  @Length(1)
  content: string;

  format(): void {
    this.student_class = this.student_class.trim();
    this.title = this.title.trim();
    this.content = this.content.trim();
  }

  abstract toCourseEntity(teacherId: string | number): CourseEntity;
}
