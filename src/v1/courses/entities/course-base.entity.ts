import { Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PersonEntity } from '../../people';

export abstract class CourseBaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => PersonEntity, (person) => person.id)
  teacher_id: number;

  @Column()
  student_class: string;

  @Column()
  title: string;

  @Column()
  content: string;

  protected constructor(
    teacher_id: number,
    student_class: string,
    title: string,
    content: string,
  ) {
    this.teacher_id = teacher_id;
    this.student_class = student_class;
    this.title = title;
    this.content = content;
  }
}
