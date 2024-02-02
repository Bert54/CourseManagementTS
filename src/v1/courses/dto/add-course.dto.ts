import { CourseEntity } from '../entities';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class AddCourseDto {
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
