import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { PersonEntity } from '../../people';

@Entity('course')
export class CourseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  teacher_id: number;

  @Column()
  student_class: string;

  @Column()
  title: string;

  @Column()
  content: string;

  constructor(
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
